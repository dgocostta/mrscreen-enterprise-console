export default function Header() {
  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-[15px] font-bold text-white">MR Screen</h1>
        <span className="text-[11px] font-medium text-muted px-2.5 py-1 rounded-md bg-white/[0.04] border border-border">
          Enterprise Console
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search agents, products..."
            className="w-56 h-8 bg-white/[0.04] border border-border rounded-lg px-3 pl-8 text-[12px] text-muted-fg placeholder:text-muted/60 focus:outline-none focus:border-accent/30 transition-colors"
          />
          <svg
            className="absolute left-2.5 w-3.5 h-3.5 text-muted"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3.5 3.5" strokeLinecap="round" />
          </svg>
        </div>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.04] border border-border hover:bg-white/[0.06] transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2a5 5 0 00-5 5v2.5L2.5 12a.75.75 0 00.5 1.25h12a.75.75 0 00.5-1.25L14 9.5V7a5 5 0 00-5-5z"
              stroke="#71717a"
              strokeWidth="1.5"
            />
            <path d="M7 14a2 2 0 004 0" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center shadow-lg">
            3
          </span>
        </button>
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/40 to-orange-900/40 flex items-center justify-center text-[11px] font-bold text-accent ring-2 ring-accent/20">
            AJ
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-white leading-tight">Andrew</span>
            <span className="text-[10px] text-muted">Admin</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1 text-muted">
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </header>
  );
}
