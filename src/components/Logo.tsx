export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]"
        >
          <rect width="36" height="36" rx="8" fill="#18181b" />
          <path
            d="M8 26L14 10L18 26"
            stroke="#FF6B00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 26L20 10L24 26"
            stroke="#FF6B00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
          <path
            d="M20 26L26 10L30 26"
            stroke="#FF6B00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />
        </svg>
        <div className="absolute inset-0 rounded-lg bg-accent/10 blur-md -z-10" />
      </div>
      <div className="flex flex-col">
        <span className="text-[15px] font-bold tracking-tight text-white leading-tight">
          MR Screen
        </span>
        <span className="text-[10px] font-medium text-muted tracking-widest uppercase">
          Enterprise
        </span>
      </div>
    </div>
  );
}
