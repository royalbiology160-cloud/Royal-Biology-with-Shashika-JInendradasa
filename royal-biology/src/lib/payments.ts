import { createClient } from "@/lib/supabase/server";

/**
 * Server-side check: does the student currently have active (approved + not expired) payment?
 * NEVER rely only on frontend for access control.
 */
export async function hasActivePayment(studentId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("id, status, valid_until")
    .eq("student_id", studentId)
    .eq("status", "approved")
    .or(`valid_until.is.null,valid_until.gt.${new Date().toISOString()}`)
    .limit(1);

  if (error) {
    console.error("Payment check error:", error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

export async function getLatestPayment(studentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}
