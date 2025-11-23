import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type GradeRequest = {
  submission?: string;
  assignment?: string;
  learnerProfile?: string;
  submissionId?: string;
};

export async function POST(request: Request) {
  try {
    const { submission, assignment, learnerProfile, submissionId } = (await request.json()) as GradeRequest;

    if (!submission || typeof submission !== "string") {
      return NextResponse.json({ error: "Missing submission text." }, { status: 400 });
    }

    const apiKey = process.env.ALLOQULY_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing ALLOQULY_AI_API_KEY." }, { status: 500 });
    }

    const payload = buildOpenAIRequest(submission, assignment, learnerProfile);

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!aiResponse.ok) {
      const text = await aiResponse.text();
      console.error("Grade API error", text);
      return NextResponse.json({ error: "AI grading service unavailable." }, { status: aiResponse.status });
    }

    const data = (await aiResponse.json()) as OpenAIResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "AI response malformed." }, { status: 502 });
    }

    const parsed = JSON.parse(content) as AIGradeResult;
    if (submissionId) {
      await persistGrade(submissionId, parsed);
    }

    return NextResponse.json({
      score: parsed.score ?? 0,
      rubric: parsed.rubric ?? [],
      summary: parsed.summary ?? "",
      strengths: parsed.strengths ?? [],
      next_steps: parsed.next_steps ?? [],
      source: "openai" as const,
    });
  } catch (error) {
    console.error("Grade API failure", error);
    return NextResponse.json({ error: "AI grading service unavailable." }, { status: 500 });
  }
}

function buildOpenAIRequest(submission: string, assignment?: string, learnerProfile?: string) {
  return {
    model: "gpt-4o-mini",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an assistive grading coach for neuroinclusive classrooms. Strip identifying details and return JSON with score (0-100), rubric array, summary, strengths, and next_steps.",
      },
      {
        role: "user",
        content: `Assignment context (optional): ${assignment ?? "N/A"}\nLearner profile: ${learnerProfile ?? "Not provided"}\nSubmission:\n${submission}\n\nReturn JSON:\n{\n score: number;\n rubric: Array<{label:string; score:number; of:number; note:string}>;\n summary: string;\n strengths: string[];\n next_steps: string[];\n}\nFocus on clarity, evidence, structure, modality options, and accommodation fidelity.`,
      },
    ],
  };
}

type OpenAIResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

type AIGradeResult = {
  score?: number;
  rubric?: Array<{ label: string; score: number; of: number; note: string }>;
  summary?: string;
  next_steps?: string[];
  strengths?: string[];
};

async function persistGrade(submissionId: string, grade: AIGradeResult) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const payload = {
      graded: true,
      score: grade.score ?? null,
      feedback: grade.summary ?? null,
      rubric: grade.rubric ?? [],
      strengths: grade.strengths ?? [],
      next_steps: grade.next_steps ?? [],
    };
    const { error } = await supabase.from("submissions").update(payload).eq("id", submissionId);
    if (error) {
      console.error("Persist grade error", error);
    }
  } catch (error) {
    console.error("Grade persistence failure", error);
  }
}
