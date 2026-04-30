"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  buyerName: string;
  buyerEmail: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  vat: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
}

const statusColors: Record<string, string> = {
  draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  paid: "bg-green-500/10 text-green-400 border-green-500/20",
  overdue: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    buyerName: "", buyerEmail: "", buyerAddress: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }] as { description: string; quantity: number; unitPrice: number }[],
    vatRate: 23,
    notes: "",
  });

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(collection(db, "invoices"));
        setInvoices(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Invoice[]);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  const subtotal = form.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const vat = subtotal * (form.vatRate / 100);
  const total = subtotal + vat;

  const addItem = () => setForm({ ...form, items: [...form.items, { description: "", quantity: 1, unitPrice: 0 }] });
  const removeItem = (idx: number) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  const updateItem = (idx: number, field: string, value: any) => {
    const items = [...form.items];
    (items[idx] as any)[field] = value;
    setForm({ ...form, items });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const invNum = `INV-${String(invoices.length + 1).padStart(4, "0")}`;
      const ref = await addDoc(collection(db, "invoices"), {
        invoiceNumber: invNum,
        date: new Date().toISOString(),
        buyerName: form.buyerName,
        buyerEmail: form.buyerEmail,
        buyerAddress: form.buyerAddress,
        items: form.items.map((i) => ({ ...i, unitPrice: Number(i.unitPrice), quantity: Number(i.quantity) })),
        subtotal, vat, total,
        vatRate: form.vatRate,
        status: "draft",
        notes: form.notes,
        createdAt: serverTimestamp(),
      });
      setInvoices([...invoices, {
        id: ref.id, invoiceNumber: invNum, date: new Date().toISOString(),
        buyerName: form.buyerName, buyerEmail: form.buyerEmail,
        items: form.items, subtotal, vat, total, status: "draft",
      }]);
      setForm({ buyerName: "", buyerEmail: "", buyerAddress: "", items: [{ description: "", quantity: 1, unitPrice: 0 }], vatRate: 23, notes: "" });
      setShowForm(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-white">Invoices</h2>
          <p className="text-[13px] text-muted">{invoices.length} invoices</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="h-9 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
          {showForm ? "Cancel" : "+ New Invoice"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card border border-accent/20 rounded-xl p-6 space-y-5">
          <h3 className="text-[14px] font-semibold text-white">Create Invoice</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Buyer Name *</label>
              <input type="text" value={form.buyerName} onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                required className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Buyer Email</label>
              <input type="email" value={form.buyerEmail} onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Buyer Address</label>
            <input type="text" value={form.buyerAddress} onChange={(e) => setForm({ ...form, buyerAddress: e.target.value })}
              className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold text-muted-fg uppercase">Line Items</label>
              <button type="button" onClick={addItem} className="text-[11px] text-accent hover:text-accent/80">+ Add Item</button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-6">
                    {idx === 0 && <span className="text-[9px] text-muted uppercase">Description</span>}
                    <input type="text" value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)}
                      placeholder="Product/service" required
                      className="w-full h-9 px-3 text-[12px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
                  </div>
                  <div className="col-span-2">
                    {idx === 0 && <span className="text-[9px] text-muted uppercase">Qty</span>}
                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                      className="w-full h-9 px-2 text-[12px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50" />
                  </div>
                  <div className="col-span-3">
                    {idx === 0 && <span className="text-[9px] text-muted uppercase">Unit Price (€)</span>}
                    <input type="number" step="0.01" min="0" value={item.unitPrice} onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="w-full h-9 px-2 text-[12px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50" />
                  </div>
                  <div className="col-span-1">
                    {form.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(idx)} className="h-9 w-full flex items-center justify-center text-red-400/60 hover:text-red-400">✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-background border border-border rounded-lg p-4 space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-[12px]">
              <span className="text-muted">Subtotal</span>
              <span className="text-white font-medium">€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[12px] items-center">
              <span className="text-muted">VAT</span>
              <div className="flex items-center gap-2">
                <select value={form.vatRate} onChange={(e) => setForm({ ...form, vatRate: parseInt(e.target.value) })}
                  className="h-7 px-1 text-[10px] bg-card border border-border rounded text-white">
                  <option value="0">0%</option>
                  <option value="13">13.5%</option>
                  <option value="23">23%</option>
                </select>
                <span className="text-white font-medium">€{vat.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-[14px] font-bold border-t border-border pt-2">
              <span className="text-white">Total</span>
              <span className="text-accent">€{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="h-10 px-6 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50">
              {saving ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      )}

      {/* Invoice List */}
      {loading ? (
        <div className="text-center py-20 text-muted">Loading...</div>
      ) : invoices.length === 0 && !showForm ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <span className="text-[48px]">🧾</span>
          <h3 className="text-[16px] font-semibold text-white mt-4">No invoices yet</h3>
          <p className="text-[13px] text-muted mt-2">Create your first invoice to get started.</p>
        </div>
      ) : invoices.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background/50 text-[10px] font-semibold text-muted uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-5 py-3">Invoice #</th>
                <th className="px-5 py-3">Buyer</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 text-[13px] font-mono text-accent">{inv.invoiceNumber}</td>
                  <td className="px-5 py-4 text-[13px] text-white">{inv.buyerName}</td>
                  <td className="px-5 py-4 text-[12px] text-muted-fg">{inv.date ? new Date(inv.date).toLocaleDateString() : "—"}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-white">€{inv.total?.toFixed(2) || "0.00"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${statusColors[inv.status] || statusColors.draft}`}>
                      {inv.status}
                    </span>
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
