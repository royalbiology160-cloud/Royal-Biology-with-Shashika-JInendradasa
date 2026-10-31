"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatLKR } from "@/lib/utils";
import { Loader2, Upload, CheckCircle2, Clock, XCircle } from "lucide-react";

const MONTHLY_FEE = 3500; // LKR – change as needed

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState(MONTHLY_FEE);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });

    setPayments(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let receipt_url = null;

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `receipts/${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(path, file);

      if (uploadError) {
        setMessage("Receipt upload failed: " + uploadError.message);
        setSubmitting(false);
        return;
      }
      receipt_url = path;
    }

    const { error } = await supabase.from("payments").insert({
      student_id: user.id,
      amount,
      status: "pending",
      method: "bank_transfer",
      receipt_url,
      notes: notes || null,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Payment submitted successfully. Admin will review soon.");
      setNotes("");
      setFile(null);
      loadPayments();
    }
    setSubmitting(false);
  }

  const statusIcon = (s: string) => {
    if (s === "approved") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (s === "rejected" || s === "expired") return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-royal-dark">Payments</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submit Payment */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold">Submit Payment</h2>

          <div className="mb-4 rounded-xl bg-royal-light/50 p-4 text-sm">
            <p className="font-medium text-royal-dark">Bank Transfer Details</p>
            <p className="mt-2">Bank: Commercial Bank / Bank of Ceylon</p>
            <p>Account Name: Royal Biology</p>
            <p>Account No: XXXX-XXXX-XXXX</p>
            <p className="mt-2 text-royal-primary font-medium">
              Monthly Fee: {formatLKR(MONTHLY_FEE)}
            </p>
            <p className="mt-1 text-xs text-royal-text/60">
              (Update bank details in Admin Settings)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Amount (LKR)</label>
              <input
                type="number"
                className="input"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Notes</label>
              <input
                className="input"
                placeholder="Transaction reference / bank"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Upload Receipt</label>
              <input
                type="file"
                accept="image/*,.pdf"
                className="input"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {message && (
              <p className="text-sm text-royal-primary">{message}</p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Submit Payment
            </button>
          </form>
        </div>

        {/* History */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold">Payment History</h2>
          {loading ? (
            <p className="text-sm text-royal-text/60">Loading...</p>
          ) : payments.length === 0 ? (
            <p className="text-sm text-royal-text/60">No payments yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-royal-primary/10 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{formatLKR(p.amount)}</p>
                    <p className="text-xs text-royal-text/60">
                      {new Date(p.created_at).toLocaleDateString("si-LK")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm capitalize">
                    {statusIcon(p.status)}
                    {p.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
