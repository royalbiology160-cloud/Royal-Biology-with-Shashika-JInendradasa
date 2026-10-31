import { createClient } from "@/lib/supabase/server";
import { Users, CreditCard, Video, Radio, FileQuestion, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalStudents },
    { count: pendingPayments },
    { count: totalLessons },
    { count: upcomingLive },
    { count: totalExams },
  ] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("live_classes").select("*", { count: "exact", head: true }).gte("start_time", new Date().toISOString()),
    supabase.from("exams").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Students", value: totalStudents ?? 0, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Pending Payments", value: pendingPayments ?? 0, icon: CreditCard, color: "bg-amber-50 text-amber-600" },
    { label: "Uploaded Lessons", value: totalLessons ?? 0, icon: Video, color: "bg-royal-light text-royal-primary" },
    { label: "Upcoming Live", value: upcomingLive ?? 0, icon: Radio, color: "bg-purple-50 text-purple-600" },
    { label: "Total Exams", value: totalExams ?? 0, icon: FileQuestion, color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-royal-dark">Admin Dashboard</h1>
      <p className="text-sm text-royal-text/70">2027 Revision · Full control panel</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-royal-dark">{s.value}</p>
            <p className="text-xs text-royal-text/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="mb-2 font-semibold text-royal-dark">Quick Actions</h2>
        <p className="text-sm text-royal-text/70">
          Use the sidebar to manage Students, Payments (approve/reject), Lessons,
          Live Classes, Exams, Notes, and Announcements. All data is connected to
          the single <strong>2027 Revision</strong> course.
        </p>
      </div>
    </div>
  );
}
