"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeBatches: 0,
    listed: 0,
    inStock: 0,
    sold: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsSnap, batchesSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "batches")),
        ]);

        const products = productsSnap.docs.map((d) => d.data());
        const activeBatches = batchesSnap.docs.filter(
          (d) => d.data().status !== "complete"
        ).length;

        setStats({
          totalProducts: products.length,
          activeBatches,
          listed: products.filter((p) => p.status === "listed" || p.status === "active").length,
          inStock: products.filter((p) => p.status === "in-stock").length,
          sold: products.filter((p) => p.status === "sold").length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const v = loading ? "..." : null;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[20px] font-bold text-white">Welcome back, Andrew</h2>
          <p className="text-[13px] text-muted">
            Here&apos;s your operation overview for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/batches/new"
            className="h-9 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            + New Batch
          </Link>
        </div>
      </div>

      {/* Today's KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPI label="Total Products" value={v || stats.totalProducts.toString()} icon="📦" />
        <KPI label="In Stock" value={v || stats.inStock.toString()} icon="🏭" color="blue" />
        <KPI label="Listed / Active" value={v || stats.listed.toString()} icon="🟢" color="green" />
        <KPI label="Sold" value={v || stats.sold.toString()} icon="💰" color="purple" />
        <KPI label="Active Batches" value={v || stats.activeBatches.toString()} icon="📋" color="amber" />
        <KPI label="Pending Orders" value="—" icon="🚚" color="red" />
      </div>

      {/* Today's Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Today */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-white">Sales Today</h3>
            <span className="text-[10px] text-muted">Last 24h</span>
          </div>
          <p className="text-[28px] font-bold text-white">€0.00</p>
          <p className="text-[11px] text-muted mt-1">0 orders</p>
        </div>

        {/* Leads & Enquiries */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-white">Leads & Enquiries</h3>
            <Link href="/crm" className="text-[10px] text-accent hover:text-accent/80">View all →</Link>
          </div>
          <p className="text-[28px] font-bold text-white">—</p>
          <p className="text-[11px] text-muted mt-1">New enquiries today</p>
        </div>

        {/* Deliveries */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-white">Deliveries</h3>
            <Link href="/orders" className="text-[10px] text-accent hover:text-accent/80">View all →</Link>
          </div>
          <p className="text-[28px] font-bold text-white">—</p>
          <p className="text-[11px] text-muted mt-1">Scheduled today</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-[14px] font-semibold text-white">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickAction href="/batches/new" title="New Incoming Batch" icon="📦" description="Register a pallet or clearout" />
        <QuickAction href="/testing" title="Testing Station" icon="🔬" description="Test and grade products" />
        <QuickAction href="/invoices/new" title="Create Invoice" icon="🧾" description="Generate a new invoice" />
        <QuickAction href="/catalog" title="Product Catalog" icon="📋" description="View all products" />
      </div>

      {/* Warehouse Overview */}
      <h3 className="text-[14px] font-semibold text-white">Warehouse Stock</h3>
      <div className="grid grid-cols-3 gap-4">
        <WarehouseCard name="Warehouse D" color="#FF6B00" label="D" />
        <WarehouseCard name="Warehouse A" color="#3B82F6" label="A" />
        <WarehouseCard name="Warehouse C" color="#10B981" label="C" />
      </div>
    </>
  );
}

function KPI({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color?: string;
}) {
  const colorClass = {
    blue: "border-blue-500/20",
    green: "border-green-500/20",
    purple: "border-purple-500/20",
    amber: "border-amber-500/20",
    red: "border-red-500/20",
  }[color || ""] || "border-border";

  return (
    <div className={`bg-card border ${colorClass} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[16px]">{icon}</span>
        <p className="text-[9px] font-semibold text-muted uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-[22px] font-bold text-white">{value}</p>
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
      className="bg-card border border-border rounded-xl p-4 hover:bg-card-hover hover:border-accent/20 transition-all group"
    >
      <span className="text-[22px]">{icon}</span>
      <h4 className="text-[12px] font-semibold text-white mt-2 group-hover:text-accent transition-colors">
        {title}
      </h4>
      <p className="text-[10px] text-muted mt-0.5">{description}</p>
    </Link>
  );
}

function WarehouseCard({ name, color, label }: { name: string; color: string; label: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-[14px] font-bold text-white"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {label}
        </div>
        <span className="text-[13px] font-medium text-white">{name}</span>
      </div>
      <p className="text-[22px] font-bold text-white">—</p>
      <p className="text-[10px] text-muted">items in stock</p>
    </div>
  );
}
