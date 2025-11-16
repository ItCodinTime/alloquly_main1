import { NextResponse } from "next/server";

const SUPPORTED_PROFILES = ["ADHD", "Autism", "Dyslexia", "Custom"];
const MAX_CHAR = 1800;

const FALLBACK_RESPONSE = {
  summary:
    "Chunked into three micro-missions with visible timers. Language is literal, sensory-sensitive, and offers text + audio response paths.",
  accommodations: [
    "Mission cards stay under 70 words with bolded verbs.",
    "Timer + dopamine check after each mission to anchor attention.",
    "Voice, text, or visual board submission with auto transcription.",
  ],
  missions: [
    "Mission 1 · Spark sensory map – Watch 40s clip, list 2 sensory moments.",
    "Mission 2 · Data hunt – Highlight the statistic and explain why it matters.",
    "Mission 3 · Response burst – 90-word reflection or voice note with auto pauses.",
  ],
};

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
      return NextResponse.json(
        {
          variant: profile,
          ...FALLBACK_RESPONSE,
          source: "mock" as const,
        },
        { status: 200 },
      );
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
      console.error("Remodel API error", await aiResponse.text());
      return NextResponse.json(
        {
          variant: profile,
          ...FALLBACK_RESPONSE,
          source: "mock" as const,
        },
        { status: aiResponse.status === 429 ? 429 : 200 },
      );
    }

    const data = (await aiResponse.json()) as OpenAIResponse;
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        {
          variant: profile,
          ...FALLBACK_RESPONSE,
          source: "mock" as const,
        },
        { status: 200 },
      );
    }

    const parsed = JSON.parse(content) as OpenAIResult;
    return NextResponse.json(
      {
        variant: profile,
        summary: parsed.summary ?? FALLBACK_RESPONSE.summary,
        accommodations:
          parsed.accommodations?.slice(0, 5) ?? FALLBACK_RESPONSE.accommodations,
        missions: parsed.missions?.slice(0, 4) ?? FALLBACK_RESPONSE.missions,
        source: "openai" as const,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Remodel API failure", error);
    return NextResponse.json(
      {
        variant: "Unknown",
        ...FALLBACK_RESPONSE,
        source: "mock" as const,
      },
      { status: 200 },
    );
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
