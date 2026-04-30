"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import MetricCards from "@/components/MetricCards";
import Link from "next/link";

interface RecentActivity {
  id: string;
  type: "batch" | "product" | "sale";
  title: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [batchCount, setBatchCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [productsSnap, batchesSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "batches")),
        ]);
        setProductCount(productsSnap.size);
        setBatchCount(batchesSnap.size);
      } catch (err) {
        console.error("Failed to fetch counts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[20px] font-bold text-white">Welcome back, Andrew</h2>
          <p className="text-[13px] text-muted">Here&apos;s what&apos;s happening across your operation today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/batches/new"
            className="h-9 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            + New Batch
          </Link>
          <Link
            href="/catalog"
            className="h-9 px-4 text-[12px] font-medium text-muted-fg bg-card border border-border rounded-lg hover:bg-card-hover transition-colors flex items-center gap-2"
          >
            View Catalog
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Products" value={loading ? "..." : productCount.toString()} />
        <StatCard label="Active Batches" value={loading ? "..." : batchCount.toString()} />
        <StatCard label="Listed" value="58" />
        <StatCard label="Sold (Month)" value="—" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <QuickAction
          href="/batches/new"
          title="New Incoming Batch"
          description="Register a new pallet or clearout"
          icon="📦"
        />
        <QuickAction
          href="/testing"
          title="Testing Station"
          description="Test and grade products"
          icon="🔬"
        />
        <QuickAction
          href="/invoices/new"
          title="Create Invoice"
          description="Generate a new invoice"
          icon="🧾"
        />
      </div>

      {/* Warehouse Overview */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-[14px] font-semibold text-white mb-4">Warehouse Stock</h3>
        <div className="grid grid-cols-3 gap-4">
          <WarehouseCard name="Warehouse D" color="#FF6B00" />
          <WarehouseCard name="Warehouse A" color="#3B82F6" />
          <WarehouseCard name="Warehouse C" color="#10B981" />
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">{label}</p>
      <p className="text-[24px] font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-xl p-5 hover:bg-card-hover hover:border-accent/20 transition-all group"
    >
      <span className="text-[24px]">{icon}</span>
      <h4 className="text-[13px] font-semibold text-white mt-3 group-hover:text-accent transition-colors">
        {title}
      </h4>
      <p className="text-[11px] text-muted mt-1">{description}</p>
    </Link>
  );
}

function WarehouseCard({ name, color }: { name: string; color: string }) {
  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[12px] font-medium text-white">{name}</span>
      </div>
      <p className="text-[20px] font-bold text-white">—</p>
      <p className="text-[10px] text-muted">items in stock</p>
    </div>
  );
}
