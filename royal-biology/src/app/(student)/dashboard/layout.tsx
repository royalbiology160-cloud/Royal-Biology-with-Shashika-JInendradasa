import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StudentSidebar } from "@/components/layout/StudentSidebar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen bg-royal-bg">
      <StudentSidebar studentName={profile?.full_name} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl p-4 pt-16 lg:p-6 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
