"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Listing {
  id: string;
  productName: string;
  platform: string;
  url: string;
  price: number;
  status: "active" | "sold" | "expired";
  views?: number;
  messages?: number;
}

const platformConfig: Record<string, { icon: string; color: string }> = {
  ebay: { icon: "🛒", color: "text-yellow-400" },
  adverts: { icon: "📋", color: "text-blue-400" },
  donedeal: { icon: "🤝", color: "text-green-400" },
  facebook: { icon: "📘", color: "text-blue-500" },
};

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  sold: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  expired: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ productName: "", platform: "ebay", url: "", price: 0 });

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(collection(db, "listings"));
        setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Listing[]);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ref = await addDoc(collection(db, "listings"), {
        ...form, price: Number(form.price), status: "active", views: 0, messages: 0, createdAt: serverTimestamp(),
      });
      setListings([...listings, { id: ref.id, ...form, price: Number(form.price), status: "active" }]);
      setForm({ productName: "", platform: "ebay", url: "", price: 0 });
      setShowForm(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const activeCount = listings.filter((l) => l.status === "active").length;
  const soldCount = listings.filter((l) => l.status === "sold").length;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-white">Active Listings</h2>
          <p className="text-[13px] text-muted">{activeCount} active · {soldCount} sold · {listings.length} total</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="h-9 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90">
          {showForm ? "Cancel" : "+ Add Listing"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card border border-accent/20 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Product Name *</label>
              <input type="text" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })}
                required className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Platform</label>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none">
                <option value="ebay">🛒 eBay</option><option value="adverts">📋 Adverts</option>
                <option value="donedeal">🤝 DoneDeal</option><option value="facebook">📘 Facebook</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Listing URL</label>
              <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..." className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-fg uppercase mb-1">Price (€)</label>
              <input type="number" step="0.01" min="0" value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="w-full h-10 px-3 text-[13px] bg-background border border-border rounded-lg text-white focus:outline-none focus:border-accent/50" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="h-10 px-6 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50">
            {saving ? "Adding..." : "Add Listing"}
          </button>
        </form>
      )}

      {listings.length > 0 ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background/50 text-[10px] font-semibold text-muted uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Platform</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map((listing) => {
                const pc = platformConfig[listing.platform] || { icon: "🔗", color: "text-muted" };
                return (
                  <tr key={listing.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-[13px] font-medium text-white">{listing.productName}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[12px] ${pc.color}`}>{pc.icon} {listing.platform}</span>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-bold text-white">€{listing.price?.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${statusColors[listing.status]}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {listing.url ? (
                        <a href={listing.url} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] text-accent hover:text-accent/80">View Ad →</a>
                      ) : <span className="text-[10px] text-muted">No link</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : !loading && !showForm && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <span className="text-[48px]">📡</span>
          <h3 className="text-[16px] font-semibold text-white mt-4">No listings yet</h3>
          <p className="text-[13px] text-muted mt-2">Add your eBay, Adverts, DoneDeal and Facebook listings here.</p>
        </div>
      )}
    </>
  );
}
