import { createClient } from "@/lib/supabase/server";
import { getGreeting } from "@/lib/utils";
import { hasActivePayment, getLatestPayment } from "@/lib/payments";
import Link from "next/link";
import {
  BookOpen,
  Video,
  Radio,
  FileText,
  CreditCard,
  Brain,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: student } = await supabase
    .from("students")
    .select("student_id, ai_credits")
    .eq("id", user.id)
    .single();

  const activePayment = await hasActivePayment(user.id);
  const latestPayment = await getLatestPayment(user.id);

  const { data: liveClasses } = await supabase
    .from("live_classes")
    .select("*")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(3);

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const greeting = getGreeting();
  const name = profile?.full_name || "Student";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card overflow-hidden bg-gradient-to-r from-royal-primary to-royal-dark p-0 text-white">
        <div className="px-6 py-6 sm:px-8">
          <h1 className="text-xl font-bold sm:text-2xl">
            {greeting}, {name}!
          </h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/90">
            <span>Student ID: <strong>{student?.student_id || "—"}</strong></span>
            <span>Class: <strong>2027 Revision</strong></span>
            <span className="flex items-center gap-1">
              Payment:{" "}
              {activePayment ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/30 px-2 py-0.5 text-xs">
                  <AlertCircle className="h-3 w-3" /> Inactive
                </span>
              )}
            </span>
            <span>AI Credits: <strong>{student?.ai_credits ?? 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: "/dashboard/class", label: "මගේ පන්තිය", icon: BookOpen },
          { href: "/dashboard/exams", label: "Online Exams", icon: FileText },
          { href: "/dashboard/live", label: "Live Classes", icon: Radio },
          { href: "/dashboard/notes", label: "Notes", icon: FileText },
        ].map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="card flex flex-col items-center gap-2 py-4 text-center transition hover:border-royal-primary/30 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal-light">
              <q.icon className="h-5 w-5 text-royal-primary" />
            </div>
            <span className="text-sm font-medium">{q.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Payment warning */}
          {!activePayment && (
            <div className="card border-amber-200 bg-amber-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-800">Payment Required</h3>
                  <p className="mt-1 text-sm text-amber-700">
                    Recorded lessons සහ paid materials access කිරීමට payment approve
                    වී තිබිය යුතුය. කරුණාකර payment submit කරන්න.
                  </p>
                  <Link
                    href="/dashboard/payments"
                    className="mt-2 inline-block text-sm font-medium text-royal-primary hover:underline"
                  >
                    Go to Payments →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Live */}
          <div className="card">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-royal-dark">
              <Radio className="h-5 w-5 text-royal-primary" />
              Upcoming Live Classes
            </h2>
            {liveClasses && liveClasses.length > 0 ? (
              <div className="space-y-3">
                {liveClasses.map((lc: any) => (
                  <div
                    key={lc.id}
                    className="flex items-center justify-between rounded-xl border border-royal-primary/10 bg-royal-bg/50 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{lc.title}</p>
                      <p className="text-xs text-royal-text/60">
                        {new Date(lc.start_time).toLocaleString("si-LK")}
                      </p>
                    </div>
                    {lc.zoom_link || lc.youtube_link ? (
                      <a
                        href={lc.zoom_link || lc.youtube_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        Join
                      </a>
                    ) : (
                      <span className="text-xs text-royal-text/50">Soon</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-royal-text/60">
                දැනට upcoming live classes නොමැත.
              </p>
            )}
          </div>

          {/* Continue Learning placeholder */}
          <div className="card">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-royal-dark">
              <Video className="h-5 w-5 text-royal-primary" />
              Continue Learning
            </h2>
            <p className="text-sm text-royal-text/60">
              ඔබ නරඹන ලද lessons මෙහි පෙනෙනු ඇත. Recorded Lessons වෙත ගොස් පාඩම්
              ආරම්භ කරන්න.
            </p>
            <Link
              href="/dashboard/recordings"
              className="mt-3 inline-block text-sm font-medium text-royal-primary hover:underline"
            >
              View Recordings →
            </Link>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="mb-3 font-semibold text-royal-dark">Quick Access</h3>
            <div className="space-y-2">
              <Link href="/dashboard/payments" className="flex items-center gap-2 text-sm hover:text-royal-primary">
                <CreditCard className="h-4 w-4" /> Payments
              </Link>
              <Link href="/dashboard/ai-tutor" className="flex items-center gap-2 text-sm hover:text-royal-primary">
                <Brain className="h-4 w-4" /> AI Tutor
              </Link>
              <Link href="/dashboard/notes" className="flex items-center gap-2 text-sm hover:text-royal-primary">
                <FileText className="h-4 w-4" /> Notes / Tutes
              </Link>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-3 font-semibold text-royal-dark">Recent Notices</h3>
            {announcements && announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.map((a: any) => (
                  <div key={a.id} className="border-b border-royal-primary/5 pb-2 last:border-0">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-royal-text/50">
                      {new Date(a.created_at).toLocaleDateString("si-LK")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-royal-text/60">නිවේදන නොමැත.</p>
            )}
          </div>

          <div className="card">
            <h3 className="mb-2 font-semibold text-royal-dark">Payment Status</h3>
            {latestPayment ? (
              <div className="text-sm">
                <p>
                  Status:{" "}
                  <span className="font-medium capitalize">{latestPayment.status}</span>
                </p>
                {latestPayment.valid_until && (
                  <p className="mt-1 text-xs text-royal-text/60">
                    Valid until: {new Date(latestPayment.valid_until).toLocaleDateString("si-LK")}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-royal-text/60">No payment records yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
