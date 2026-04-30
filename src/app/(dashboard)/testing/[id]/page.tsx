"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, updateDoc, addDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import Link from "next/link";

interface BatchItem {
  id: string;
  name: string;
  sku: string;
  image: string;
  condition: string;
  testResult: "pending" | "sellable" | "scrap";
  grade: string | null;
  notes: string;
}

interface Batch {
  name: string;
  source: string;
  warehouse: string;
  totalItems: number;
  testedCount: number;
  sellableCount: number;
  scrapCount: number;
}

export default function TestBatchPage() {
  const params = useParams();
  const batchId = params.id as string;
  const [batch, setBatch] = useState<Batch | null>(null);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const batchDoc = await getDoc(doc(db, "batches", batchId));
        if (batchDoc.exists()) setBatch(batchDoc.data() as Batch);

        const snap = await getDocs(collection(db, "batches", batchId, "items"));
        const pending = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as BatchItem))
          .filter((i) => i.testResult === "pending");
        setItems(pending);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [batchId]);

  const currentItem = items[currentIndex];

  const handleResult = async (result: "sellable" | "scrap", grade?: string) => {
    if (!currentItem || processing) return;
    setProcessing(true);
    try {
      // Update item
      await updateDoc(doc(db, "batches", batchId, "items", currentItem.id), {
        testResult: result,
        grade: grade || null,
        testedAt: serverTimestamp(),
      });

      // Update batch counters
      const field = result === "sellable" ? "sellableCount" : "scrapCount";
      await updateDoc(doc(db, "batches", batchId), {
        testedCount: increment(1),
        [field]: increment(1),
      });

      // If sellable, add to products
      if (result === "sellable") {
        await addDoc(collection(db, "products"), {
          name: currentItem.name,
          sku: currentItem.sku,
          category: "",
          condition: currentItem.condition,
          grade: grade || "B",
          purchasePrice: 0,
          sellPrice: 0,
          warehouse: batch?.warehouse || "D",
          quantity: 1,
          images: currentItem.image ? [currentItem.image] : [],
          specs: {},
          status: "in-stock",
          batchId,
          listingIds: [],
          notes: currentItem.notes,
          createdAt: serverTimestamp(),
        });
      }

      // Move to next
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // All done
        setItems([]);
      }

      if (batch) {
        setBatch({
          ...batch,
          testedCount: (batch.testedCount || 0) + 1,
          sellableCount: (batch.sellableCount || 0) + (result === "sellable" ? 1 : 0),
          scrapCount: (batch.scrapCount || 0) + (result === "scrap" ? 1 : 0),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>;

  if (!batch) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Batch not found</p>
        <Link href="/testing" className="text-accent text-[13px] mt-2 inline-block">← Back</Link>
      </div>
    );
  }

  if (items.length === 0 || currentIndex >= items.length) {
    return (
      <div className="text-center py-20">
        <span className="text-[64px]">✅</span>
        <h2 className="text-[22px] font-bold text-white mt-4">All items tested!</h2>
        <p className="text-[14px] text-muted mt-2">
          {batch.name} — {batch.sellableCount || 0} sellable, {batch.scrapCount || 0} scrap
        </p>
        <Link
          href="/testing"
          className="inline-block mt-6 px-6 py-2.5 text-[12px] font-medium text-white bg-accent rounded-lg"
        >
          Back to Testing Station
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/testing" className="text-[12px] text-muted hover:text-white transition-colors">
          ← Back to Testing Station
        </Link>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-white">{batch.name}</h2>
        <span className="text-[12px] text-muted">
          {currentIndex + 1} of {items.length} remaining
        </span>
      </div>
      <div className="h-2 bg-card border border-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex) / items.length) * 100}%` }}
        />
      </div>

      {/* Current Item — Big Card */}
      <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto">
        {/* Image */}
        <div className="flex justify-center mb-6">
          {currentItem.image ? (
            <img
              src={currentItem.image}
              alt={currentItem.name}
              className="w-64 h-64 object-cover rounded-xl border border-border"
            />
          ) : (
            <div className="w-64 h-64 rounded-xl bg-background border border-border flex items-center justify-center">
              <span className="text-muted text-[14px]">No image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="text-center mb-8">
          <h3 className="text-[20px] font-bold text-white">{currentItem.name}</h3>
          <div className="flex items-center justify-center gap-4 mt-2">
            {currentItem.sku && (
              <span className="text-[11px] font-mono text-muted bg-background px-2 py-1 rounded">
                SKU: {currentItem.sku}
              </span>
            )}
            <span className="text-[11px] text-muted capitalize">{currentItem.condition}</span>
          </div>
          {currentItem.notes && (
            <p className="text-[12px] text-muted-fg mt-2">{currentItem.notes}</p>
          )}
        </div>

        {/* Action Buttons — Pass / Fail */}
        <div className="space-y-4">
          <p className="text-center text-[11px] font-semibold text-muted uppercase tracking-wider">
            Test Result
          </p>

          {/* Pass — Grade Selection */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleResult("sellable", "A")}
              disabled={processing}
              className="flex-1 max-w-[140px] h-16 rounded-xl bg-green-500/10 border-2 border-green-500/30 text-green-400 font-bold text-[14px] hover:bg-green-500/20 hover:border-green-500/50 transition-all disabled:opacity-50"
            >
              ✅ Grade A
              <span className="block text-[9px] font-normal text-green-500/60 mt-0.5">Like New</span>
            </button>
            <button
              onClick={() => handleResult("sellable", "B")}
              disabled={processing}
              className="flex-1 max-w-[140px] h-16 rounded-xl bg-blue-500/10 border-2 border-blue-500/30 text-blue-400 font-bold text-[14px] hover:bg-blue-500/20 hover:border-blue-500/50 transition-all disabled:opacity-50"
            >
              ✅ Grade B
              <span className="block text-[9px] font-normal text-blue-500/60 mt-0.5">Good</span>
            </button>
            <button
              onClick={() => handleResult("sellable", "C")}
              disabled={processing}
              className="flex-1 max-w-[140px] h-16 rounded-xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-400 font-bold text-[14px] hover:bg-amber-500/20 hover:border-amber-500/50 transition-all disabled:opacity-50"
            >
              ✅ Grade C
              <span className="block text-[9px] font-normal text-amber-500/60 mt-0.5">Fair</span>
            </button>
          </div>

          {/* Fail */}
          <div className="flex justify-center">
            <button
              onClick={() => handleResult("scrap")}
              disabled={processing}
              className="w-full max-w-[440px] h-14 rounded-xl bg-red-500/10 border-2 border-red-500/30 text-red-400 font-bold text-[14px] hover:bg-red-500/20 hover:border-red-500/50 transition-all disabled:opacity-50"
            >
              ❌ Scrap
              <span className="block text-[9px] font-normal text-red-500/60 mt-0.5">Not sellable</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
