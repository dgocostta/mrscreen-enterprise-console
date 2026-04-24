interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  sparklinePoints: string;
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted/50 cursor-help">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 6v4M7 4.5v.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SparklineSVG({ points }: { points: string }) {
  return (
    <svg viewBox="0 0 80 32" className="w-full h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,32 ${points} 80,32`}
        fill="url(#sparkGrad)"
      />
      <polyline
        points={points}
        fill="none"
        stroke="#FF6B00"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetricCard({ title, value, change, positive, sparklinePoints }: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 hover:border-accent/10 transition-colors group">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted uppercase tracking-wide">{title}</span>
        <InfoIcon />
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[22px] font-bold text-white leading-none">{value}</span>
          <span className={`text-[11px] font-semibold flex items-center gap-1 ${positive ? "text-emerald-400" : "text-red-400"}`}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d={positive ? "M5 2l3 4H2l3-4z" : "M5 8L2 4h6L5 8z"}
                fill="currentColor"
              />
            </svg>
            {change}
          </span>
        </div>
        <div className="w-20 flex-shrink-0">
          <SparklineSVG points={sparklinePoints} />
        </div>
      </div>
    </div>
  );
}

const metricsData: MetricCardProps[] = [
  {
    title: "Active Screens",
    value: "2,847",
    change: "+12.5%",
    positive: true,
    sparklinePoints: "0,24 10,20 20,22 30,16 40,18 50,10 60,12 70,6 80,8",
  },
  {
    title: "Content Plays",
    value: "1.2M",
    change: "+8.3%",
    positive: true,
    sparklinePoints: "0,22 10,18 20,24 30,14 40,20 50,12 60,8 70,14 80,6",
  },
  {
    title: "Revenue / Screen",
    value: "$342",
    change: "+5.7%",
    positive: true,
    sparklinePoints: "0,26 10,24 20,20 30,22 40,16 50,14 60,10 70,12 80,4",
  },
  {
    title: "Uptime SLA",
    value: "99.7%",
    change: "-0.2%",
    positive: false,
    sparklinePoints: "0,8 10,10 20,6 30,12 40,8 50,14 60,10 70,16 80,12",
  },
  {
    title: "AI Tasks Done",
    value: "18,432",
    change: "+22.1%",
    positive: true,
    sparklinePoints: "0,28 10,22 20,26 30,18 40,14 50,16 60,8 70,10 80,4",
  },
];

export default function MetricCards() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {metricsData.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}
