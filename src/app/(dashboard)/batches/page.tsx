"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Batch {
  id: string;
  name: string;
  source: string;
  warehouse: string;
  dateReceived: string;
  totalItems: number;
  testedCount: number;
  sellableCount: number;
  scrapCount: number;
  status: "incoming" | "testing" | "complete";
}

const statusColors: Record<string, string> = {
  incoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  testing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  complete: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatches() {
      try {
        const snap = await getDocs(collection(db, "batches"));
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Batch[];
        setBatches(data);
      } catch (err) {
        console.error("Failed to fetch batches:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBatches();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-white">Warehouse Batches</h2>
          <p className="text-[13px] text-muted">Manage incoming pallets and clearouts</p>
        </div>
        <Link
          href="/batches/new"
          className="h-9 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
        >
          + New Batch
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Loading batches...</div>
      ) : batches.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <span className="text-[48px]">📦</span>
          <h3 className="text-[16px] font-semibold text-white mt-4">No batches yet</h3>
          <p className="text-[13px] text-muted mt-2">
            Register your first incoming pallet or clearout to get started.
          </p>
          <Link
            href="/batches/new"
            className="inline-block mt-4 px-6 py-2.5 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            Create First Batch
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background/50 text-[10px] font-semibold text-muted uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-5 py-3">Batch Name</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Warehouse</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Tested</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-medium text-white">{batch.name}</span>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-muted-fg">{batch.source || "—"}</td>
                  <td className="px-5 py-4 text-[12px] text-muted-fg">{batch.warehouse || "—"}</td>
                  <td className="px-5 py-4 text-[12px] text-white font-medium">{batch.totalItems || 0}</td>
                  <td className="px-5 py-4 text-[12px] text-muted-fg">
                    {batch.testedCount || 0} / {batch.totalItems || 0}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                        statusColors[batch.status] || statusColors.incoming
                      }`}
                    >
                      {batch.status || "incoming"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/batches/${batch.id}`}
                      className="text-[11px] font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
