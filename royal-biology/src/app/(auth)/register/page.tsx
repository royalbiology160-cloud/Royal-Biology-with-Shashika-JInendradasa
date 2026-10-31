"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    school: "",
    password: "",
    confirmPassword: "",
    extraInfo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          role: "student",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError("Registration failed. Please try again.");
      setLoading(false);
      return;
    }

    const seq = Math.floor(Date.now() / 1000) % 10000;
    const studentId = `RB2027-${String(seq).padStart(4, "0")}`;

    await supabase.from("students").insert({
      id: authData.user.id,
      student_id: studentId,
      school: form.school || null,
      extra_info: form.extraInfo || null,
    });

    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", "2027-revision")
      .single();

    if (course) {
      await supabase.from("enrollments").insert({
        student_id: authData.user.id,
        course_id: course.id,
      });
    }

    await supabase
      .from("profiles")
      .update({ mobile: form.mobile, full_name: form.fullName })
      .eq("id", authData.user.id);

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-royal-bg px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal-primary text-white text-xl font-bold">
              RB
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-royal-dark">Register</h1>
          <p className="mt-1 text-sm text-royal-text/70">
            2027 Revision පන්තියට ලියාපදිංචි වන්න
          </p>
        </div>

        <form onSubmit={handleRegister} className="card space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium">Full Name *</label>
            <input
              required
              className="input"
              placeholder="සම්පූර්ණ නම"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email *</label>
              <input
                type="email"
                required
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Mobile *</label>
              <input
                required
                className="input"
                placeholder="07X XXX XXXX"
                value={form.mobile}
                onChange={(e) => update("mobile", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">School</label>
            <input
              className="input"
              placeholder="පාසලේ නම"
              value={form.school}
              onChange={(e) => update("school", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Additional Info</label>
            <textarea
              className="input min-h-[70px]"
              placeholder="අමතර තොරතුරු (optional)"
              value={form.extraInfo}
              onChange={(e) => update("extraInfo", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Password *</label>
              <input
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Confirm Password *</label>
              <input
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Register & Join 2027 Revision
          </button>

          <p className="text-center text-sm text-royal-text/70">
            දැනටමත් ගිණුමක් තිබේද?{" "}
            <Link href="/login" className="font-medium text-royal-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
