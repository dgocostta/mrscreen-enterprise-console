import Logo from "./Logo";

const sidebarGroups = [
  {
    label: "AI AGENTS",
    items: [
      { name: "Agent Dashboard", icon: "dashboard", active: true },
      { name: "Content Agents", icon: "agents" },
      { name: "Pricing Agent", icon: "pricing" },
      { name: "Analytics Agent", icon: "analytics" },
    ],
  },
  {
    label: "CONTENT & PRODUCTS",
    items: [
      { name: "Product Catalog", icon: "catalog" },
      { name: "Digital Signage", icon: "signage" },
      { name: "Campaign Manager", icon: "campaign" },
      { name: "Media Library", icon: "media" },
    ],
  },
  {
    label: "CLIENTS & CONFIG",
    items: [
      { name: "Client Accounts", icon: "clients" },
      { name: "Store Locations", icon: "stores" },
      { name: "System Settings", icon: "settings" },
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
    agents: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3" stroke={color} strokeWidth="1.5" />
        <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    pricing: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2v14M5 5h8M6 9h6M7 13h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    analytics: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 14l4-5 3 3 5-7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 5h4v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    catalog: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M2 7h14M7 7v9" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    signage: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="10" rx="1.5" stroke={color} strokeWidth="1.5" />
        <path d="M6 15h6M9 12v3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    campaign: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 9l3-6h6l3 6-3 6H6L3 9z" stroke={color} strokeWidth="1.5" />
        <circle cx="9" cy="9" r="2" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    media: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke={color} strokeWidth="1.5" />
        <circle cx="6.5" cy="6.5" r="1.5" stroke={color} strokeWidth="1.2" />
        <path d="M2 13l4-4 3 3 2-2 5 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    clients: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="7" cy="6" r="2.5" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="7" r="2" stroke={color} strokeWidth="1.2" />
        <path d="M1 16c0-3 2.2-5 6-5s6 2 6 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    stores: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L2 7v9h14V7L9 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="7" y="11" width="4" height="5" stroke={color} strokeWidth="1.2" />
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
              {group.items.map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      item.active
                        ? "bg-accent-dim text-white"
                        : "text-muted-fg hover:bg-white/[0.03] hover:text-white"
                    }`}
                  >
                    <span className={`flex-shrink-0 ${item.active ? "" : ""}`}>
                      <SidebarIcon icon={item.icon} active={item.active} />
                    </span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center text-[11px] font-bold text-accent">
            AJ
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-medium text-white leading-tight">Alex Johnson</span>
            <span className="text-[10px] text-muted">Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
