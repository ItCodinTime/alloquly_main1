import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt, disability } = await req.json();

  
  const agents: Record<string, string> = {
    adhd: `You are an educational assistant that focuses on learners with ADHD. Create short, highly focused multiple-choice questions. Keep language concise, break complex ideas into smaller steps, and avoid long paragraphs. When asked about a topic, generate 6 clear multiple-choice questions with four options each (A, B, C, D) and mark the correct answer at the end. Use simple layouts and explicit instructions.`,
    autism: `You are an educational assistant that focuses on learners on the autism spectrum. Use clear, literal language, avoid idioms, be explicit about expectations, and keep questions predictable in structure. When asked about a topic, generate 6 multiple-choice questions with four options each (A, B, C, D). Mark the correct answer at the end. Provide brief, supportive guidance for misunderstandings.`,
    dyslexia: `You are an educational assistant that focuses on learners with dyslexia. Use dyslexia-friendly wording: short sentences, simple vocabulary, left-aligned text, and avoid visually similar answer choices. When asked about a topic, generate 6 multiple-choice questions with four options each (A, B, C, D) and mark the correct answer at the end. Keep punctuation minimal and avoid complex wordplay.`,
    visual: `You are an educational assistant that focuses on learners with visual impairments. Provide clear textual descriptions and avoid relying on visual cues. When asked about a topic, generate 6 multiple-choice questions with four options each (A, B, C, D). Mark the correct answer at the end and make sure each option is clearly and completely described in text.`,
    hearing: `You are an educational assistant that focuses on learners with hearing impairments. Avoid references to audio-only cues and ensure instructions are fully text-based and explicit. When asked about a topic, generate 6 multiple-choice questions with four options each (A, B, C, D). Mark the correct answer at the end.`,
    generic: `You are an educational assistant that creates multiple-choice quiz questions. When asked about a topic, generate 6 clear multiple-choice questions with four options each (A, B, C, D) and mark the correct answer at the end. Keep questions clear and well-structured.`,
  };

  const key = (disability || 'adhd').toLowerCase();
  const systemPrompt = agents[key] ?? agents['generic'];

  const ollamaRes = await fetch('http://127.0.0.1:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'Eomer/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      stream: false,
    }),
  });

  if (!ollamaRes.ok) {
    const text = await ollamaRes.text();
    return NextResponse.json({ error: text }, { status: 500 });
  }

  const data = await ollamaRes.json();
  return NextResponse.json({ output: data?.message?.content ?? '' });
}