"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, collectionGroup } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface BatchWithPending {
  id: string;
  name: string;
  warehouse: string;
  source: string;
  totalItems: number;
  testedCount: number;
  pendingCount: number;
}

export default function TestingStationPage() {
  const [batches, setBatches] = useState<BatchWithPending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatchesWithPending() {
      try {
        const batchSnap = await getDocs(collection(db, "batches"));
        const batchList: BatchWithPending[] = [];

        for (const batchDoc of batchSnap.docs) {
          const data = batchDoc.data();
          const pendingCount = (data.totalItems || 0) - (data.testedCount || 0);
          if (pendingCount > 0 || (data.status !== "complete")) {
            batchList.push({
              id: batchDoc.id,
              name: data.name || "Unnamed Batch",
              warehouse: data.warehouse || "—",
              source: data.source || "",
              totalItems: data.totalItems || 0,
              testedCount: data.testedCount || 0,
              pendingCount: Math.max(pendingCount, 0),
            });
          }
        }

        setBatches(batchList);
      } catch (err) {
        console.error("Failed to fetch batches:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBatchesWithPending();
  }, []);

  return (
    <>
      <div>
        <h2 className="text-[20px] font-bold text-white">Testing Station</h2>
        <p className="text-[13px] text-muted mt-1">
          Select a batch to start testing and grading products.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Loading...</div>
      ) : batches.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <span className="text-[48px]">🔬</span>
          <h3 className="text-[16px] font-semibold text-white mt-4">All caught up!</h3>
          <p className="text-[13px] text-muted mt-2">
            No batches with pending items. Create a new batch to start testing.
          </p>
          <Link
            href="/batches/new"
            className="inline-block mt-4 px-6 py-2.5 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90"
          >
            Create New Batch
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <Link
              key={batch.id}
              href={`/batches/${batch.id}`}
              className="bg-card border border-border rounded-xl p-5 hover:border-accent/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold text-white group-hover:text-accent transition-colors">
                    {batch.name}
                  </h3>
                  <p className="text-[11px] text-muted mt-0.5">
                    Warehouse {batch.warehouse} {batch.source ? `• ${batch.source}` : ""}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">
                  {batch.pendingCount} pending
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-muted mb-1">
                  <span>Progress</span>
                  <span>
                    {batch.testedCount} / {batch.totalItems}
                  </span>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{
                      width: `${batch.totalItems > 0 ? (batch.testedCount / batch.totalItems) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
