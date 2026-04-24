export default function TVSignage() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-bold text-white">TV Signage Preview</h2>
          <span className="text-[10px] font-medium text-muted bg-white/[0.04] px-2 py-0.5 rounded-md">
            Portrait 9:16
          </span>
        </div>
        <button className="h-7 px-3 text-[11px] font-medium text-muted-fg bg-white/[0.04] border border-border rounded-lg hover:bg-white/[0.06] transition-colors flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4-2 4 2v5l-4 2-4-2V4z" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          Edit Template
        </button>
      </div>
      <div className="flex justify-center">
        <div className="relative">
          {/* Hardware bezel */}
          <div className="rounded-[20px] bg-[#1a1a1e] p-[12px] shadow-2xl">
            {/* Inner screen */}
            <div
              className="relative rounded-[10px] overflow-hidden flex flex-col items-center justify-between"
              style={{
                width: "220px",
                height: "390px",
                background: "linear-gradient(180deg, #0a0a0f 0%, #12121a 40%, #0f0f18 100%)",
              }}
            >
              {/* Subtle grid overlay */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Top: Logo area */}
              <div className="flex flex-col items-center pt-10 relative z-10">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 36 36"
                  fill="none"
                  className="drop-shadow-[0_0_12px_rgba(255,107,0,0.6)] mb-4"
                >
                  <path d="M6 28L13 8L18 28" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 28L19 8L24 28" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                  <path d="M18 28L25 8L30 28" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                </svg>
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                  MR Screen
                </span>
              </div>

              {/* Center: Main text */}
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[24px] font-bold text-white leading-tight tracking-tight text-center" style={{ fontStyle: "normal" }}>
                    SEE MORE.
                  </span>
                  <span className="text-[24px] font-bold text-white leading-tight tracking-tight text-center" style={{ fontStyle: "normal" }}>
                    DO MORE.
                  </span>
                </div>
                <p className="text-[10px] font-medium text-white/40 text-center px-8 leading-relaxed">
                  Enterprise-grade digital signage for the modern workplace
                </p>
              </div>

              {/* Bottom: CTA */}
              <div className="flex flex-col items-center pb-10 relative z-10">
                <button
                  className="px-6 py-2.5 rounded-full text-[11px] font-bold text-white bg-accent relative"
                  style={{
                    boxShadow: "0 0 30px 8px rgba(255,107,0,0.4), 0 0 60px 16px rgba(255,107,0,0.15)",
                  }}
                >
                  Explore Now
                </button>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Accent glow effect */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
          {/* Stand / reflection hint */}
          <div className="mx-auto w-16 h-1 bg-[#1a1a1e] rounded-b-lg" />
        </div>
      </div>
    </div>
  );
}
