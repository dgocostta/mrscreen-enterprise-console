"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewBatchPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    source: "",
    warehouse: "D",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, "batches"), {
        name: form.name.trim(),
        source: form.source.trim(),
        warehouse: form.warehouse,
        notes: form.notes.trim(),
        dateReceived: new Date().toISOString(),
        totalItems: 0,
        testedCount: 0,
        sellableCount: 0,
        scrapCount: 0,
        status: "incoming",
        createdAt: serverTimestamp(),
      });
      router.push(`/batches/${docRef.id}`);
    } catch (err) {
      console.error("Failed to create batch:", err);
      alert("Failed to create batch. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/batches" className="text-[12px] text-muted hover:text-white transition-colors">
          ← Back to Batches
        </Link>
      </div>

      <div className="max-w-2xl">
        <h2 className="text-[20px] font-bold text-white">New Incoming Batch</h2>
        <p className="text-[13px] text-muted mt-1">Register a new pallet or clearout arriving at the warehouse.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">
              Batch Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Google Office Clearout - April 2026"
              className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">
              Source / Supplier
            </label>
            <input
              type="text"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="e.g., Google Dublin, Amazon Returns, etc."
              className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">
              Warehouse *
            </label>
            <div className="flex gap-3">
              {["D", "A", "C"].map((wh) => (
                <button
                  key={wh}
                  type="button"
                  onClick={() => setForm({ ...form, warehouse: wh })}
                  className={`flex-1 h-12 rounded-lg border text-[14px] font-bold transition-all ${
                    form.warehouse === wh
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-background border-border text-muted hover:border-muted"
                  }`}
                >
                  Warehouse {wh}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional details about this batch..."
              rows={3}
              className="w-full px-3 py-2.5 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || !form.name.trim()}
              className="h-10 px-6 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Creating..." : "Create Batch"}
            </button>
            <Link
              href="/batches"
              className="h-10 px-6 text-[12px] font-medium text-muted-fg bg-card border border-border rounded-lg hover:bg-card-hover transition-colors flex items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
