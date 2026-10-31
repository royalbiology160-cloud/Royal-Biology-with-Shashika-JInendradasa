import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: student } = await supabase
      .from("students")
      .select("ai_credits")
      .eq("id", user.id)
      .single();

    if (!student || student.ai_credits <= 0) {
      return NextResponse.json(
        { error: "AI credits අවසන් වී ඇත." },
        { status: 403 }
      );
    }

    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "AI service not configured. Set GEMINI_API_KEY in environment variables.",
        },
        { status: 503 }
      );
    }

    // Google Gemini API call
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a helpful A/L Biology tutor for Sri Lankan students. Prefer answering in Sinhala when the question is in Sinhala, otherwise English. Keep answers clear and exam-oriented.\n\nStudent question: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const geminiData = await geminiRes.json();
    const reply =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not generate a response.";

    // Deduct 1 credit
    const newCredits = student.ai_credits - 1;
    await supabase
      .from("students")
      .update({ ai_credits: newCredits })
      .eq("id", user.id);

    await supabase.from("ai_usage").insert({
      student_id: user.id,
      prompt_preview: message.slice(0, 100),
      tokens_used: 1,
    });

    return NextResponse.json({ reply, credits: newCredits });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
