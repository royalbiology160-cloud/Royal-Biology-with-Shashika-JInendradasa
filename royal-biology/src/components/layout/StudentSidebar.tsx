"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Video,
  Radio,
  FileQuestion,
  ClipboardList,
  Trophy,
  FileText,
  CreditCard,
  CalendarCheck,
  Bell,
  Brain,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "මුල් පිටුව", icon: Home },
  { href: "/dashboard/class", label: "මගේ පන්තිය", icon: BookOpen },
  { href: "/dashboard/recordings", label: "Recorded Lessons", icon: Video },
  { href: "/dashboard/live", label: "Live Classes", icon: Radio },
  { href: "/dashboard/exams", label: "Online Exams", icon: FileQuestion },
  { href: "/dashboard/quiz", label: "Online Quiz", icon: ClipboardList },
  { href: "/dashboard/results", label: "Results", icon: Trophy },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/notes", label: "Notes / Tutes", icon: FileText },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck },
  { href: "/dashboard/announcements", label: "නිවේදන", icon: Bell },
  { href: "/dashboard/ai-tutor", label: "AI Biology Tutor", icon: Brain },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function StudentSidebar({ studentName }: { studentName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const Nav = () => (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              active
                ? "bg-royal-primary text-white shadow-sm"
                : "text-royal-text/80 hover:bg-royal-light hover:text-royal-primary"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl bg-white p-2 shadow-md lg:hidden"
      >
        <Menu className="h-5 w-5 text-royal-primary" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-royal-primary/10 bg-white transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-royal-primary/10 px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-royal-primary text-sm font-bold text-white">
              RB
            </div>
            <div>
              <p className="text-sm font-bold text-royal-dark">Royal Biology</p>
              <p className="text-[10px] text-royal-primary">2027 Revision</p>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Nav />

        <div className="border-t border-royal-primary/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
