"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  sku: string;
  condition: string;
  grade: string;
  warehouse: string;
  quantity: number;
  sellPrice: number;
  purchasePrice: number;
  status: string;
  images: string[];
  listingIds: string[];
  platforms?: string[];
}

const gradeColors: Record<string, string> = {
  A: "bg-green-500/10 text-green-400 border-green-500/20",
  B: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  C: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const statusConfig: Record<string, { bg: string; text: string }> = {
  "in-stock": { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400" },
  listed: { bg: "bg-green-500/10 border-green-500/20", text: "text-green-400" },
  sold: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400" },
  scrapped: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400" },
  active: { bg: "bg-green-500/10 border-green-500/20", text: "text-green-400" },
};

const warehouseColors: Record<string, string> = {
  D: "text-accent bg-accent/10",
  A: "text-blue-400 bg-blue-500/10",
  C: "text-green-400 bg-green-500/10",
};

const platformIcons: Record<string, string> = {
  ebay: "🛒",
  adverts: "📋",
  donedeal: "🤝",
  facebook: "📘",
};

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchWarehouse = filterWarehouse === "all" || p.warehouse === filterWarehouse;
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchWarehouse && matchStatus;
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-white">Product Catalog</h2>
          <p className="text-[13px] text-muted">
            {loading ? "Loading..." : `${products.length} products across all warehouses`}
          </p>
        </div>
        <Link
          href="/catalog/new"
          className="h-9 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
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
        <select
          value={filterWarehouse}
          onChange={(e) => setFilterWarehouse(e.target.value)}
          className="h-10 px-3 text-[12px] bg-card border border-border rounded-lg text-white focus:outline-none focus:border-accent/50"
        >
          <option value="all">All Warehouses</option>
          <option value="D">Warehouse D</option>
          <option value="A">Warehouse A</option>
          <option value="C">Warehouse C</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 px-3 text-[12px] bg-card border border-border rounded-lg text-white focus:outline-none focus:border-accent/50"
        >
          <option value="all">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="listed">Listed</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="scrapped">Scrapped</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <span className="text-[48px]">📋</span>
          <h3 className="text-[16px] font-semibold text-white mt-4">
            {search || filterWarehouse !== "all" || filterStatus !== "all"
              ? "No products match your filters"
              : "No products yet"}
          </h3>
          <p className="text-[13px] text-muted mt-2">
            Products are added when you grade items as sellable in the Testing Station.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => {
            const sc = statusConfig[product.status] || statusConfig["in-stock"];
            return (
              <div
                key={product.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-accent/20 transition-all group"
              >
                {/* Image */}
                <div className="relative h-44 bg-background">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted text-[12px]">
                      No image
                    </div>
                  )}
                  {/* Grade badge */}
                  {product.grade && (
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        gradeColors[product.grade] || ""
                      }`}
                    >
                      Grade {product.grade}
                    </span>
                  )}
                  {/* Warehouse badge */}
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                      warehouseColors[product.warehouse] || "text-muted bg-background"
                    }`}
                  >
                    WH {product.warehouse}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="text-[13px] font-medium text-white leading-tight line-clamp-2">
                    {product.name}
                  </h4>
                  {product.sku && (
                    <p className="text-[10px] text-muted font-mono mt-1">SKU: {product.sku}</p>
                  )}

                  {/* Price + Status */}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[16px] font-bold text-white">
                      {product.sellPrice ? `€${product.sellPrice.toFixed(2)}` : "—"}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text}`}
                    >
                      {product.status || "in-stock"}
                    </span>
                  </div>

                  {/* Platforms */}
                  {product.platforms && product.platforms.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[9px] text-muted uppercase">Listed on:</span>
                      {product.platforms.map((p) => (
                        <span key={p} className="text-[12px]" title={p}>
                          {platformIcons[p] || "🔗"}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Link
                      href={`/catalog/${product.id}`}
                      className="flex-1 h-8 flex items-center justify-center text-[10px] font-medium text-muted-fg bg-background border border-border rounded-lg hover:text-white hover:border-accent/30 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/catalog/${product.id}/edit`}
                      className="flex-1 h-8 flex items-center justify-center text-[10px] font-medium text-accent bg-accent/10 border border-accent/20 rounded-lg hover:bg-accent/20 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
