"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-[260px] min-h-screen">
        <Header />
        <div className="p-6 space-y-6">{children}</div>
      </main>
    </div>
  );
}
