import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  const hasAIKey = Boolean(process.env.ALLOQULY_AI_API_KEY);
  return NextResponse.json({ hasAIKey });
}
