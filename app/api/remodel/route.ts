import { NextResponse } from "next/server";

const SUPPORTED_PROFILES = ["ADHD", "Autism", "Dyslexia", "Custom"];
const MAX_CHAR = 1800;

export async function POST(request: Request) {
  try {
    const { assignment, profile } = (await request.json()) as {
      assignment?: string;
      profile?: string;
    };

    if (!assignment || typeof assignment !== "string") {
      return NextResponse.json(
        { error: "Missing assignment content." },
        { status: 400 },
      );
    }

    if (!profile || !SUPPORTED_PROFILES.includes(profile)) {
      return NextResponse.json(
        { error: "Unsupported learner profile." },
        { status: 400 },
      );
    }

    const truncated = assignment.slice(0, MAX_CHAR);
    const apiKey = process.env.ALLOQULY_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing ALLOQULY_AI_API_KEY." }, { status: 500 });
    }

    const payload = buildOpenAIRequest(truncated, profile);

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
      console.error("Remodel API error", text);
      return NextResponse.json({ error: "AI remodel service unavailable." }, { status: aiResponse.status });
    }

    const data = (await aiResponse.json()) as OpenAIResponse;
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json({ error: "AI response malformed." }, { status: 502 });
    }

    const parsed = JSON.parse(content) as OpenAIResult;
    return NextResponse.json(
      {
        variant: profile,
        summary: parsed.summary ?? "",
        accommodations: parsed.accommodations?.slice(0, 5) ?? [],
        missions: parsed.missions?.slice(0, 4) ?? [],
        source: "openai" as const,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Remodel API failure", error);
    return NextResponse.json({ error: "AI remodel service unavailable." }, { status: 500 });
  }
}

function buildOpenAIRequest(assignment: string, profile: string) {
  return {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are Alloquly, an instructional designer who rewrites teacher assignments for neurodiverse learners. Return JSON that educators can read out loud.",
      },
      {
        role: "user",
        content: `Assignment:\n${assignment}\n\nLearner profile: ${profile}\n\nRespond with JSON containing:\n- summary: A brief description of how the assignment was adapted\n- accommodations: Array of 3-5 specific accommodations applied\n- missions: Array of 3-4 chunked tasks, each under 30 words\n\nMake it practical, clear, and actionable for ${profile} learners.`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  };
}

type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type OpenAIResult = {
  summary?: string;
  accommodations?: string[];
  missions?: string[];
};
