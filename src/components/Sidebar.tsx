"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const sidebarGroups = [
  {
    label: "OPERATIONS",
    items: [
      { name: "Dashboard", href: "/", icon: "dashboard" },
      { name: "Product Catalog", href: "/catalog", icon: "catalog" },
      { name: "Warehouse Batches", href: "/batches", icon: "batches" },
      { name: "Testing Station", href: "/testing", icon: "testing" },
    ],
  },
  {
    label: "SALES & MARKETING",
    items: [
      { name: "Active Listings", href: "/listings", icon: "listings" },
      { name: "Funnel Manager", href: "/funnels", icon: "funnels" },
      { name: "Lead CRM", href: "/crm", icon: "crm" },
      { name: "Order Tracker", href: "/orders", icon: "orders" },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { name: "Calendar", href: "/calendar", icon: "calendar" },
      { name: "Invoices", href: "/invoices", icon: "invoices" },
      { name: "Media Library", href: "/media", icon: "media" },
      { name: "Social Manager", href: "/social", icon: "social" },
    ],
  },
  {
    label: "CONFIG",
    items: [
      { name: "Digital Signage", href: "/signage", icon: "signage" },
      { name: "Store Locations", href: "/locations", icon: "locations" },
      { name: "System Settings", href: "/settings", icon: "settings" },
    ],
  },
];

function SidebarIcon({ icon, active }: { icon: string; active?: boolean }) {
  const color = active ? "#FF6B00" : "#71717a";
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
        <rect x="10" y="1" width="7" height="4" rx="1.5" stroke={color} strokeWidth="1.5" />
        <rect x="1" y="10" width="7" height="4" rx="1.5" stroke={color} strokeWidth="1.5" />
        <rect x="10" y="7" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    catalog: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M2 7h14M7 7v9" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    batches: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="8" width="12" height="8" rx="1.5" stroke={color} strokeWidth="1.5" />
        <path d="M3 11h12" stroke={color} strokeWidth="1.5" />
        <path d="M5 8V5a1.5 1.5 0 011.5-1.5h5A1.5 1.5 0 0113 5v3" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    testing: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M7 2v5L3 14a1.5 1.5 0 001.3 2.2h9.4A1.5 1.5 0 0015 14l-4-7V2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 2h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    listings: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke={color} strokeWidth="1.5" />
        <path d="M9 5v4l3 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    funnels: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 3h14l-4 5v5l-2 2V8L2 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    crm: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="7" cy="6" r="2.5" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="7" r="2" stroke={color} strokeWidth="1.2" />
        <path d="M1 16c0-3 2.2-5 6-5s6 2 6 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    orders: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="12" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M6 7h6M6 10h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    calendar: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="13" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M2 7h14M6 1v4M12 1v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    invoices: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 2h10a1 1 0 011 1v12l-2-1-2 1-2-1-2 1-2-1-2 1V3a1 1 0 011-1z" stroke={color} strokeWidth="1.5" />
        <path d="M7 6h4M7 9h4M7 12h2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    media: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke={color} strokeWidth="1.5" />
        <circle cx="6.5" cy="6.5" r="1.5" stroke={color} strokeWidth="1.2" />
        <path d="M2 13l4-4 3 3 2-2 5 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    social: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="5" cy="9" r="2" stroke={color} strokeWidth="1.5" />
        <circle cx="13" cy="5" r="2" stroke={color} strokeWidth="1.5" />
        <circle cx="13" cy="13" r="2" stroke={color} strokeWidth="1.5" />
        <path d="M7 8l4-2M7 10l4 2" stroke={color} strokeWidth="1.2" />
      </svg>
    ),
    signage: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="10" rx="1.5" stroke={color} strokeWidth="1.5" />
        <path d="M6 15h6M9 12v3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    locations: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 16s-5-4.35-5-8a5 5 0 0110 0c0 3.65-5 8-5 8z" stroke={color} strokeWidth="1.5" />
        <circle cx="9" cy="8" r="2" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke={color} strokeWidth="1.5" />
        <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M3.3 14.7l1.4-1.4M13.3 4.7l1.4-1.4" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  };
  return <>{icons[icon] || icons.dashboard}</>;
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-sidebar min-w-[260px] h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 z-30">
      <div className="px-5 pt-6 pb-4">
        <Logo />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {sidebarGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-accent-dim text-white"
                          : "text-muted-fg hover:bg-white/[0.03] hover:text-white"
                      }`}
                    >
                      <span className="flex-shrink-0">
                        <SidebarIcon icon={item.icon} active={isActive} />
                      </span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center text-[11px] font-bold text-accent">
            AS
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-white leading-tight">Andrew</span>
            <span className="text-[10px] text-muted">Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
