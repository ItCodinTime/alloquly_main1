import { NextResponse } from "next/server";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const plainTextTypes = new Set([
  "text/plain",
  "text/markdown",
  "text/x-markdown",
  "text/csv",
  "text/html",
  "text/x-python",
  "text/richtext",
  "application/json",
]);

const arrayBufferToString = (buffer: ArrayBuffer) => {
  return new TextDecoder("utf-8").decode(buffer);
};

const extractFromRtf = (text: string) => {
  return text
    .replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\pard|\\par[d]?/g, "\n")
    .replace(/\\[a-z]+\d*/gi, "")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No file found in request." }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File is too large. Try a file under 5MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    let extractedText = "";
    const mimeType = file.type || "";
    const fileName = file instanceof File ? file.name : "uploaded-file";
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";

    if (plainTextTypes.has(mimeType) || ext === "txt" || ext === "md") {
      extractedText = arrayBufferToString(arrayBuffer);
    } else if (mimeType === "application/pdf" || ext === "pdf") {
      return NextResponse.json(
        {
          error: "PDF extraction isn't enabled. Export as plain text or RTF before uploading.",
          meta: { fileName, mimeType },
        },
        { status: 415 },
      );
    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || ext === "docx") {
      return NextResponse.json(
        {
          error: "DOCX extraction isn't supported in this environment. Export your file as PDF or RTF and try again.",
          meta: { fileName, mimeType },
        },
        { status: 415 },
      );
    } else if (mimeType === "application/rtf" || ext === "rtf") {
      extractedText = extractFromRtf(arrayBufferToString(arrayBuffer));
    } else {
      // Fallback: attempt to interpret as UTF-8 text
      extractedText = arrayBufferToString(arrayBuffer);
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        {
          error: "We couldn't extract readable text. Try uploading a PDF, DOCX, RTF, or plain text file.",
          meta: {
            fileName,
            mimeType,
          },
        },
        { status: 422 },
      );
    }

    const normalized = extractedText.replace(/\s+/g, " ").trim();
    const wordCount = normalized.split(/\s+/).length;

    return NextResponse.json({
      text: normalized,
      meta: {
        fileName,
        mimeType: mimeType || "unknown",
        wordCount,
        snippet: normalized.slice(0, 200),
      },
    });
  } catch (error) {
    console.error("File extraction error:", error);
    return NextResponse.json({ error: "Failed to read file. Please try another format." }, { status: 500 });
  }
}
