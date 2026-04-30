"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
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
  dateReceived: string;
  totalItems: number;
  testedCount: number;
  sellableCount: number;
  scrapCount: number;
  status: string;
  notes: string;
}

export default function BatchDetailPage() {
  const params = useParams();
  const batchId = params.id as string;
  const [batch, setBatch] = useState<Batch | null>(null);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", sku: "", condition: "used", notes: "" });
  const [addingItem, setAddingItem] = useState(false);

  useEffect(() => {
    async function fetchBatch() {
      try {
        const batchDoc = await getDoc(doc(db, "batches", batchId));
        if (batchDoc.exists()) {
          setBatch(batchDoc.data() as Batch);
        }
        const itemsSnap = await getDocs(collection(db, "batches", batchId, "items"));
        const itemsData = itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as BatchItem[];
        setItems(itemsData);
      } catch (err) {
        console.error("Failed to fetch batch:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBatch();
  }, [batchId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    setAddingItem(true);
    try {
      const itemRef = await addDoc(collection(db, "batches", batchId, "items"), {
        name: newItem.name.trim(),
        sku: newItem.sku.trim(),
        image: "",
        condition: newItem.condition,
        testResult: "pending",
        grade: null,
        notes: newItem.notes.trim(),
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "batches", batchId), {
        totalItems: increment(1),
      });
      setItems([
        ...items,
        {
          id: itemRef.id,
          name: newItem.name.trim(),
          sku: newItem.sku.trim(),
          image: "",
          condition: newItem.condition,
          testResult: "pending",
          grade: null,
          notes: newItem.notes.trim(),
        },
      ]);
      setNewItem({ name: "", sku: "", condition: "used", notes: "" });
      setShowAddForm(false);
      if (batch) {
        setBatch({ ...batch, totalItems: (batch.totalItems || 0) + 1 });
      }
    } catch (err) {
      console.error("Failed to add item:", err);
    } finally {
      setAddingItem(false);
    }
  };

  const handleGrade = async (itemId: string, result: "sellable" | "scrap", grade?: string) => {
    try {
      await updateDoc(doc(db, "batches", batchId, "items", itemId), {
        testResult: result,
        grade: grade || null,
        testedAt: serverTimestamp(),
      });

      const incrementField = result === "sellable" ? "sellableCount" : "scrapCount";
      await updateDoc(doc(db, "batches", batchId), {
        testedCount: increment(1),
        [incrementField]: increment(1),
      });

      // If sellable, also add to products collection
      if (result === "sellable") {
        const item = items.find((i) => i.id === itemId);
        if (item) {
          await addDoc(collection(db, "products"), {
            name: item.name,
            sku: item.sku,
            category: "",
            condition: item.condition,
            grade: grade || "B",
            purchasePrice: 0,
            sellPrice: 0,
            warehouse: batch?.warehouse || "D",
            quantity: 1,
            images: item.image ? [item.image] : [],
            specs: {},
            status: "in-stock",
            batchId: batchId,
            listingIds: [],
            notes: item.notes,
            createdAt: serverTimestamp(),
          });
        }
      }

      setItems(
        items.map((i) =>
          i.id === itemId ? { ...i, testResult: result, grade: grade || null } : i
        )
      );
      if (batch) {
        setBatch({
          ...batch,
          testedCount: (batch.testedCount || 0) + 1,
          sellableCount: (batch.sellableCount || 0) + (result === "sellable" ? 1 : 0),
          scrapCount: (batch.scrapCount || 0) + (result === "scrap" ? 1 : 0),
        });
      }
    } catch (err) {
      console.error("Failed to grade item:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-muted">Loading batch...</div>;
  }

  if (!batch) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Batch not found</p>
        <Link href="/batches" className="text-accent text-[13px] mt-2 inline-block">
          ← Back to Batches
        </Link>
      </div>
    );
  }

  const pendingItems = items.filter((i) => i.testResult === "pending");
  const testedItems = items.filter((i) => i.testResult !== "pending");

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/batches" className="text-[12px] text-muted hover:text-white transition-colors">
          ← Back to Batches
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-white">{batch.name}</h2>
          <div className="flex items-center gap-4 mt-1">
            {batch.source && <span className="text-[12px] text-muted-fg">Source: {batch.source}</span>}
            <span className="text-[12px] text-muted-fg">Warehouse {batch.warehouse}</span>
            <span className="text-[12px] text-muted-fg">
              {batch.dateReceived ? new Date(batch.dateReceived).toLocaleDateString() : "—"}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="h-9 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] font-semibold text-muted uppercase">Total Items</p>
          <p className="text-[22px] font-bold text-white mt-1">{batch.totalItems || items.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] font-semibold text-muted uppercase">Tested</p>
          <p className="text-[22px] font-bold text-white mt-1">{batch.testedCount || testedItems.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] font-semibold text-green-500 uppercase">Sellable</p>
          <p className="text-[22px] font-bold text-green-400 mt-1">{batch.sellableCount || 0}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] font-semibold text-red-500 uppercase">Scrap</p>
          <p className="text-[22px] font-bold text-red-400 mt-1">{batch.scrapCount || 0}</p>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-card border border-accent/20 rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-white mb-4">Add Product to Batch</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Dell P2217H 22-inch Monitor"
                  className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1">
                  SKU / Barcode
                </label>
                <input
                  type="text"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                  placeholder="Scan barcode or type SKU"
                  className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1">
                  Condition
                </label>
                <select
                  value={newItem.condition}
                  onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
                  className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  placeholder="Any notes..."
                  className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={addingItem}
                className="h-9 px-5 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50"
              >
                {addingItem ? "Adding..." : "Add to Batch"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="h-9 px-5 text-[12px] font-medium text-muted-fg bg-background border border-border rounded-lg hover:bg-card"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pending Testing */}
      {pendingItems.length > 0 && (
        <div>
          <h3 className="text-[14px] font-semibold text-white mb-3">
            Pending Testing ({pendingItems.length})
          </h3>
          <div className="space-y-2">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center text-muted text-[10px]">
                      No img
                    </div>
                  )}
                  <div>
                    <p className="text-[13px] font-medium text-white">{item.name}</p>
                    <div className="flex gap-3 mt-0.5">
                      {item.sku && <span className="text-[10px] text-muted">SKU: {item.sku}</span>}
                      <span className="text-[10px] text-muted capitalize">{item.condition}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGrade(item.id, "sellable", "A")}
                    className="h-8 px-3 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20"
                  >
                    Grade A
                  </button>
                  <button
                    onClick={() => handleGrade(item.id, "sellable", "B")}
                    className="h-8 px-3 text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20"
                  >
                    Grade B
                  </button>
                  <button
                    onClick={() => handleGrade(item.id, "sellable", "C")}
                    className="h-8 px-3 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20"
                  >
                    Grade C
                  </button>
                  <button
                    onClick={() => handleGrade(item.id, "scrap")}
                    className="h-8 px-3 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20"
                  >
                    Scrap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tested Items */}
      {testedItems.length > 0 && (
        <div>
          <h3 className="text-[14px] font-semibold text-white mb-3">
            Tested ({testedItems.length})
          </h3>
          <div className="space-y-2">
            {testedItems.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between opacity-75"
              >
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center text-muted text-[10px]">
                      No img
                    </div>
                  )}
                  <div>
                    <p className="text-[13px] font-medium text-white">{item.name}</p>
                    {item.sku && <span className="text-[10px] text-muted">SKU: {item.sku}</span>}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                    item.testResult === "sellable"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {item.testResult === "sellable" ? `Grade ${item.grade}` : "Scrap"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
