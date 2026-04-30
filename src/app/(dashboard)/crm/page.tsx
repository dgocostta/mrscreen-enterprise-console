"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "customer";
  notes: string;
  createdAt: any;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  customer: "bg-green-500/10 text-green-400 border-green-500/20",
};
const statusFlow = ["new", "contacted", "qualified", "customer"];

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "ebay", message: "" });

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(collection(db, "leads"));
        setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Lead[]);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ref = await addDoc(collection(db, "leads"), { ...form, status: "new", notes: "", createdAt: serverTimestamp() });
      setLeads([...leads, { id: ref.id, ...form, status: "new", notes: "", createdAt: null }]);
      setForm({ name: "", email: "", phone: "", source: "ebay", message: "" });
      setShowForm(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const advanceStatus = async (id: string, current: string) => {
    const idx = statusFlow.indexOf(current);
    if (idx < statusFlow.length - 1) {
      const next = statusFlow[idx + 1];
      await updateDoc(doc(db, "leads", id), { status: next });
      setLeads(leads.map((l) => l.id === id ? { ...l, status: next as Lead["status"] } : l));
    }
  };

  const grouped = {
    new: leads.filter((l) => l.status === "new"),
    contacted: leads.filter((l) => l.status === "contacted"),
    qualified: leads.filter((l) => l.status === "qualified"),
    customer: leads.filter((l) => l.status === "customer"),
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-white">Lead CRM</h2>
          <p className="text-[13px] text-muted">{leads.length} leads</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="h-9 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90">
          {showForm ? "Cancel" : "+ Add Lead"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card border border-accent/20 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                required className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Source</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none">
                <option value="ebay">eBay</option><option value="adverts">Adverts</option>
                <option value="donedeal">DoneDeal</option><option value="facebook">Facebook</option>
                <option value="phone">Phone</option><option value="walkin">Walk-in</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Message / Enquiry</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={2} className="w-full px-3 py-2 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none" />
          </div>
          <button type="submit" disabled={saving}
            className="h-10 px-6 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50">
            {saving ? "Adding..." : "Add Lead"}
          </button>
        </form>
      )}

      {/* Kanban-style columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(["new", "contacted", "qualified", "customer"] as const).map((status) => (
          <div key={status} className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusColors[status]}`}>
                {status}
              </span>
              <span className="text-[10px] text-muted">{grouped[status].length}</span>
            </div>
            {grouped[status].map((lead) => (
              <div key={lead.id} className="bg-card border border-border rounded-lg p-4">
                <h4 className="text-[13px] font-medium text-white">{lead.name}</h4>
                <p className="text-[10px] text-muted capitalize mt-0.5">via {lead.source}</p>
                {lead.message && <p className="text-[11px] text-muted-fg mt-2 line-clamp-2">{lead.message}</p>}
                <div className="flex items-center gap-2 mt-3">
                  {lead.email && <span className="text-[9px] text-muted truncate">📧 {lead.email}</span>}
                  {lead.phone && <span className="text-[9px] text-muted">📞 {lead.phone}</span>}
                </div>
                {status !== "customer" && (
                  <button onClick={() => advanceStatus(lead.id, status)}
                    className="mt-3 w-full h-7 text-[10px] font-medium text-accent bg-accent/10 border border-accent/20 rounded-lg hover:bg-accent/20">
                    → Move to {statusFlow[statusFlow.indexOf(status) + 1]}
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {!loading && leads.length === 0 && !showForm && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <span className="text-[48px]">👥</span>
          <h3 className="text-[16px] font-semibold text-white mt-4">No leads yet</h3>
        </div>
      )}
    </>
  );
}
