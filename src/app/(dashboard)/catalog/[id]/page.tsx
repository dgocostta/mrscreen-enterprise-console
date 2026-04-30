"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Product {
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
  category: string;
  notes: string;
  specs: Record<string, string>;
  platforms?: string[];
  batchId?: string;
  createdAt?: any;
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  "in-stock": { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400" },
  listed: { bg: "bg-green-500/10 border-green-500/20", text: "text-green-400" },
  active: { bg: "bg-green-500/10 border-green-500/20", text: "text-green-400" },
  sold: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400" },
  scrapped: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400" },
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDoc(doc(db, "products", productId));
        if (snap.exists()) setProduct(snap.data() as Product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [productId]);

  if (loading) return <div className="text-center py-20 text-muted">Loading...</div>;
  if (!product) return (
    <div className="text-center py-20">
      <p className="text-muted">Product not found</p>
      <Link href="/catalog" className="text-accent text-[13px] mt-2 inline-block">← Back to Catalog</Link>
    </div>
  );

  const sc = statusConfig[product.status] || statusConfig["in-stock"];

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/catalog" className="text-[12px] text-muted hover:text-white transition-colors">← Back to Catalog</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Images */}
        <div>
          <div className="bg-card border border-border rounded-xl overflow-hidden aspect-square flex items-center justify-center">
            {product.images?.[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-muted text-[14px]">No image</span>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImage ? "border-accent" : "border-border hover:border-muted"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text}`}>
                {product.status || "in-stock"}
              </span>
              {product.grade && (
                <span className="text-[10px] font-bold text-white bg-white/10 px-2.5 py-1 rounded-full">
                  Grade {product.grade}
                </span>
              )}
            </div>
            <h2 className="text-[22px] font-bold text-white">{product.name}</h2>
            {product.sku && <p className="text-[12px] text-muted font-mono mt-1">SKU: {product.sku}</p>}
          </div>

          {/* Price */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase">Sell Price</p>
                <p className="text-[24px] font-bold text-white mt-1">
                  {product.sellPrice ? `€${product.sellPrice.toFixed(2)}` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted uppercase">Purchase Price</p>
                <p className="text-[24px] font-bold text-muted-fg mt-1">
                  {product.purchasePrice ? `€${product.purchasePrice.toFixed(2)}` : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Warehouse" value={`Warehouse ${product.warehouse || "—"}`} />
            <InfoCard label="Quantity" value={product.quantity?.toString() || "1"} />
            <InfoCard label="Condition" value={product.condition || "—"} />
            <InfoCard label="Category" value={product.category || "—"} />
          </div>

          {/* Platforms */}
          {product.platforms && product.platforms.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-[10px] font-semibold text-muted uppercase mb-2">Listed On</p>
              <div className="flex gap-2">
                {product.platforms.map((p) => (
                  <span key={p} className="text-[11px] font-medium text-white bg-white/5 border border-border px-3 py-1.5 rounded-lg capitalize">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {product.notes && (
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-[10px] font-semibold text-muted uppercase mb-2">Notes</p>
              <p className="text-[13px] text-muted-fg">{product.notes}</p>
            </div>
          )}

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-[10px] font-semibold text-muted uppercase mb-2">Specifications</p>
              <div className="space-y-1.5">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-[12px]">
                    <span className="text-muted">{key}</span>
                    <span className="text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/catalog/${productId}/edit`}
              className="flex-1 h-10 flex items-center justify-center text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
            >
              Edit Product
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <p className="text-[9px] font-semibold text-muted uppercase">{label}</p>
      <p className="text-[13px] font-medium text-white mt-0.5 capitalize">{value}</p>
    </div>
  );
}
