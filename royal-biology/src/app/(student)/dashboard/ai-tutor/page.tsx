"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Brain, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "ආයුබෝවන්! මම Royal Biology AI Tutor. A/L Biology ප්‍රශ්න, terminology, chapter summaries හෝ MCQ explanations අසන්න. (Sinhala හෝ English)",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("students")
        .select("ai_credits")
        .eq("id", user.id)
        .single();
      setCredits(data?.ai_credits ?? 0);
    })();
  }, []);

  async function send() {
    if (!input.trim() || loading) return;
    if (credits !== null && credits <= 0) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "AI credits අවසන් වී ඇත. Admin වෙතින් credits ලබා ගන්න." },
      ]);
      return;
    }

    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.error },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.reply },
        ]);
        if (typeof data.credits === "number") setCredits(data.credits);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error connecting to AI. Please try again." },
      ]);
    }
    setLoading(false);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-royal-dark">
          <Brain className="h-6 w-6 text-royal-primary" />
          AI Biology Tutor
        </h1>
        <span className="rounded-full bg-royal-light px-3 py-1 text-xs font-medium text-royal-primary">
          Credits: {credits ?? "…"}
        </span>
      </div>

      <div className="card flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-royal-primary text-white"
                    : "bg-royal-bg text-royal-text"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-royal-bg px-4 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-royal-primary" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-royal-primary/10 p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2"
          >
            <input
              className="input flex-1"
              placeholder="Biology ප්‍රශ්නයක් අසන්න..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
