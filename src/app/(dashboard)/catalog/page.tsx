"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Product {
  id: string;
  name: string;
  sku: string;
  condition: string;
  grade: string;
  warehouse: string;
  quantity: number;
  sellPrice: number;
  status: string;
  images: string[];
}

const gradeColors: Record<string, string> = {
  A: "bg-green-500/10 text-green-400 border-green-500/20",
  B: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  C: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const warehouseColors: Record<string, string> = {
  D: "text-accent bg-accent/10",
  A: "text-blue-400 bg-blue-500/10",
  C: "text-green-400 bg-green-500/10",
};

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const snap = await getDocs(collection(db, "products"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[];
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-white">Product Catalog</h2>
          <p className="text-[13px] text-muted">
            {loading ? "Loading..." : `${products.length} products across all warehouses`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full h-10 pl-10 pr-4 text-[13px] bg-card border border-border rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-accent/50"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <span className="text-[48px]">📋</span>
          <h3 className="text-[16px] font-semibold text-white mt-4">
            {search ? "No products match your search" : "No products yet"}
          </h3>
          <p className="text-[13px] text-muted mt-2">
            Products are added automatically when you grade items as sellable in the Testing Station.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background/50 text-[10px] font-semibold text-muted uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Grade</th>
                <th className="px-5 py-3">Warehouse</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-background border border-border" />
                      )}
                      <span className="text-[13px] font-medium text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-muted-fg font-mono">{product.sku || "—"}</td>
                  <td className="px-5 py-4">
                    {product.grade ? (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          gradeColors[product.grade] || ""
                        }`}
                      >
                        Grade {product.grade}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        warehouseColors[product.warehouse] || "text-muted bg-background"
                      }`}
                    >
                      {product.warehouse}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[12px] text-white font-medium">{product.quantity || 1}</td>
                  <td className="px-5 py-4 text-[12px] text-white font-medium">
                    {product.sellPrice ? `€${product.sellPrice.toFixed(2)}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-bold uppercase text-muted-fg">{product.status || "in-stock"}</span>
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
