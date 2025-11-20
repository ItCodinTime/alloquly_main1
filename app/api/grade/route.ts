import { NextResponse } from "next/server";

type GradeRequest = {
  submission?: string;
  assignment?: string;
  learnerProfile?: string;
};

export async function POST(request: Request) {
  try {
    const { submission, assignment, learnerProfile } = (await request.json()) as GradeRequest;

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
    return NextResponse.json(
      {
        score: parsed.score ?? 0,
        rubric: parsed.rubric ?? [],
        summary: parsed.summary ?? "",
        next_steps: parsed.next_steps ?? [],
        source: "openai" as const,
      },
      { status: 200 },
    );
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
          "You are an assistive grading coach for neuroinclusive classrooms. Return JSON with a total score (0-100), rubric array, summary, and next_steps.",
      },
      {
        role: "user",
        content: `Assignment (context optional): ${assignment ?? "N/A"}\nLearner profile: ${learnerProfile ?? "Not provided"}\nSubmission:\n${submission}\n\nReturn JSON:\n{\n score: number;\n rubric: Array<{label:string; score:number; of:number; note:string}>;\n summary: string;\n next_steps: string[];\n}\nFocus feedback on clarity, evidence, structure, modality options, and accommodations fidelity. Keep notes concise and classroom-ready.`,
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
};
