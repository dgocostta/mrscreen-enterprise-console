import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MetricCards from "@/components/MetricCards";
import ProductCatalog from "@/components/ProductCatalog";
import TVSignage from "@/components/TVSignage";
import AgentActivity from "@/components/AgentActivity";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-[260px] min-h-screen">
        <Header />
        <div className="p-6 space-y-6">
          {/* Welcome bar */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[20px] font-bold text-white">Welcome back, Alex</h2>
              <p className="text-[13px] text-muted">Here&apos;s what&apos;s happening across your screen network today.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-muted">Last sync: 2 min ago</span>
              <button className="h-8 px-4 text-[12px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2 shadow-accent-glow/30">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7a6 6 0 0111.2-3M13 7A6 6 0 011.8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 1v3h-3M2 13v-3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Sync All
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <MetricCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Product Catalog + Agent Activity */}
            <div className="col-span-8 space-y-6">
              <ProductCatalog />
              <AgentActivity />
            </div>
            {/* Right: TV Signage */}
            <div className="col-span-4">
              <TVSignage />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
