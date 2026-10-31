import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  Radio,
  CreditCard,
  FileQuestion,
  FileText,
  Bell,
  Settings,
  LogOut,
  Brain,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Student Management", icon: Users },
  { href: "/admin/lessons", label: "Lesson Management", icon: BookOpen },
  { href: "/admin/recordings", label: "Video Recordings", icon: Video },
  { href: "/admin/live", label: "Live Classes", icon: Radio },
  { href: "/admin/payments", label: "Payment Management", icon: CreditCard },
  { href: "/admin/exams", label: "Examination Management", icon: FileQuestion },
  { href: "/admin/notes", label: "Notes / Tutes", icon: FileText },
  { href: "/admin/announcements", label: "Announcements", icon: Bell },
  { href: "/admin/ai", label: "AI Tutor Settings", icon: Brain },
  { href: "/admin/settings", label: "Website Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-royal-bg">
      <aside className="hidden w-64 flex-col border-r border-royal-primary/10 bg-white lg:flex">
        <div className="border-b border-royal-primary/10 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal-dark text-sm font-bold text-white">
              RB
            </div>
            <div>
              <p className="text-sm font-bold text-royal-dark">Admin Panel</p>
              <p className="text-[10px] text-royal-primary">Royal Biology</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-royal-text/80 hover:bg-royal-light hover:text-royal-primary transition"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3">
          <form action="/api/auth/logout" method="post">
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-4 lg:p-6">
        <div className="mb-4 lg:hidden">
          <p className="text-sm font-medium text-royal-primary">Admin · {profile?.full_name}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
