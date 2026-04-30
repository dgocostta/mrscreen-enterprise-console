"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Order {
  id: string;
  productName: string;
  buyerName: string;
  platform: string;
  price: number;
  status: "placed" | "confirmed" | "packed" | "shipped" | "delivered";
  trackingNumber: string;
  createdAt: any;
}

const statusFlow = ["placed", "confirmed", "packed", "shipped", "delivered"];
const statusColors: Record<string, string> = {
  placed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  confirmed: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  packed: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ productName: "", buyerName: "", platform: "ebay", price: 0, trackingNumber: "" });

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(collection(db, "orders"));
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Order[]);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ref = await addDoc(collection(db, "orders"), {
        ...form, price: Number(form.price), status: "placed", createdAt: serverTimestamp(),
      });
      setOrders([...orders, { id: ref.id, ...form, price: Number(form.price), status: "placed", createdAt: null }]);
      setForm({ productName: "", buyerName: "", platform: "ebay", price: 0, trackingNumber: "" });
      setShowForm(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const advanceStatus = async (orderId: string, currentStatus: string) => {
    const idx = statusFlow.indexOf(currentStatus);
    if (idx < statusFlow.length - 1) {
      const next = statusFlow[idx + 1];
      await updateDoc(doc(db, "orders", orderId), { status: next });
      setOrders(orders.map((o) => o.id === orderId ? { ...o, status: next as Order["status"] } : o));
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-white">Order Tracker</h2>
          <p className="text-[13px] text-muted">{orders.length} orders</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="h-9 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90">
          {showForm ? "Cancel" : "+ New Order"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card border border-accent/20 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Product *</label>
              <input type="text" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })}
                required placeholder="Product name" className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Buyer *</label>
              <input type="text" value={form.buyerName} onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                required placeholder="Buyer name" className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Platform</label>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none">
                <option value="ebay">eBay</option><option value="adverts">Adverts</option>
                <option value="donedeal">DoneDeal</option><option value="facebook">Facebook</option>
                <option value="direct">Direct</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Price (€)</label>
              <input type="number" step="0.01" min="0" value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Tracking #</label>
              <input type="text" value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })}
                placeholder="Optional" className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="h-10 px-6 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50">
            {saving ? "Creating..." : "Create Order"}
          </button>
        </form>
      )}

      {orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-medium text-white">{order.productName}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-muted-fg">{order.buyerName}</span>
                    <span className="text-[10px] text-muted capitalize bg-background px-2 py-0.5 rounded">{order.platform}</span>
                    <span className="text-[12px] font-bold text-white">€{order.price?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  {order.status !== "delivered" && (
                    <button onClick={() => advanceStatus(order.id, order.status)}
                      className="text-[10px] font-medium text-accent hover:text-accent/80 bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
                      → {statusFlow[statusFlow.indexOf(order.status) + 1]}
                    </button>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div className="flex gap-1 mt-3">
                {statusFlow.map((s, i) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full ${
                    i <= statusFlow.indexOf(order.status) ? "bg-accent" : "bg-border"
                  }`} />
                ))}
              </div>
              {order.trackingNumber && (
                <p className="text-[10px] text-muted mt-2">Tracking: {order.trackingNumber}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && !showForm && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <span className="text-[48px]">🚚</span>
          <h3 className="text-[16px] font-semibold text-white mt-4">No orders yet</h3>
        </div>
      )}
    </>
  );
}
