"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", sku: "", category: "", condition: "used", grade: "B",
    warehouse: "D", quantity: 1, sellPrice: 0, purchasePrice: 0,
    status: "in-stock", notes: "", description: "",
  });

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDoc(doc(db, "products", productId));
        if (snap.exists()) {
          const d = snap.data();
          setForm({
            name: d.name || "", sku: d.sku || "", category: d.category || "",
            condition: d.condition || "used", grade: d.grade || "B",
            warehouse: d.warehouse || "D", quantity: d.quantity || 1,
            sellPrice: d.sellPrice || 0, purchasePrice: d.purchasePrice || 0,
            status: d.status || "in-stock", notes: d.notes || "",
            description: d.description || "",
          });
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, [productId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, "products", productId), {
        ...form,
        sellPrice: Number(form.sellPrice),
        purchasePrice: Number(form.purchasePrice),
        quantity: Number(form.quantity),
        updatedAt: serverTimestamp(),
      });
      router.push(`/catalog/${productId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>;

  return (
    <>
      <Link href={`/catalog/${productId}`} className="text-[12px] text-muted hover:text-white transition-colors">← Back to Product</Link>
      <div className="max-w-2xl">
        <h2 className="text-[20px] font-bold text-white mt-2">Edit Product</h2>
        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <Field label="Product Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="SKU / Barcode" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
            <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="e.g., Monitor, Charger, Dock" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">Condition</label>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50">
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">Grade</label>
              <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50">
                <option value="A">Grade A — Like New</option>
                <option value="B">Grade B — Good</option>
                <option value="C">Grade C — Fair</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">Warehouse</label>
              <select value={form.warehouse} onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50">
                <option value="D">Warehouse D</option>
                <option value="A">Warehouse A</option>
                <option value="C">Warehouse C</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">Sell Price (€)</label>
              <input type="number" step="0.01" min="0" value={form.sellPrice}
                onChange={(e) => setForm({ ...form, sellPrice: parseFloat(e.target.value) || 0 })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">Purchase Price (€)</label>
              <input type="number" step="0.01" min="0" value={form.purchasePrice}
                onChange={(e) => setForm({ ...form, purchasePrice: parseFloat(e.target.value) || 0 })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">Quantity</label>
              <input type="number" min="0" value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50">
              <option value="in-stock">In Stock</option>
              <option value="listed">Listed</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="scrapped">Scrapped</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">Product Description (for front-end / sales page)</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4} placeholder="Describe this product for customers..."
              className="w-full px-3 py-2.5 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">Internal Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2} placeholder="Internal notes..."
              className="w-full px-3 py-2.5 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="h-10 px-6 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link href={`/catalog/${productId}`}
              className="h-10 px-6 text-[12px] font-medium text-muted-fg bg-card border border-border rounded-lg hover:bg-card-hover flex items-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

function Field({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-muted-fg uppercase tracking-wider mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        required={required}
        className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors" />
    </div>
  );
}
