interface AgentItem {
  name: string;
  task: string;
  status: "Running" | "Completed" | "Queued";
  time: string;
}

const agents: AgentItem[] = [
  { name: "Price Optimizer", task: "Analyzing competitor pricing for MR Pro 55\"", status: "Running", time: "2m ago" },
  { name: "Content Generator", task: "Creating holiday signage templates", status: "Running", time: "5m ago" },
  { name: "Inventory Scout", task: "Stock level audit for Q2 forecast", status: "Completed", time: "12m ago" },
  { name: "SEO Analyzer", task: "Product listing optimization batch", status: "Completed", time: "18m ago" },
  { name: "Support Bot", task: "Processing 23 pending tickets", status: "Queued", time: "22m ago" },
];

function StatusDot({ status }: { status: AgentItem["status"] }) {
  const color = status === "Running" ? "bg-emerald-400" : status === "Completed" ? "bg-blue-400" : "bg-amber-400";
  return (
    <span className="relative flex h-2 w-2">
      {status === "Running" && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-50`} />
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`} />
    </span>
  );
}

export default function AgentActivity() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-[14px] font-bold text-white">Agent Activity</h2>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            2 Active
          </span>
        </div>
        <button className="text-[11px] font-medium text-accent hover:text-accent/80 transition-colors">
          View All
        </button>
      </div>
      <div className="divide-y divide-border/50">
        {agents.map((agent) => (
          <div key={agent.name} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v3M7 10v3M1 7h3M10 7h3" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="7" r="2" stroke="#FF6B00" strokeWidth="1.3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-white">{agent.name}</span>
                <StatusDot status={agent.status} />
                <span className={`text-[10px] font-medium ${
                  agent.status === "Running" ? "text-emerald-400" : agent.status === "Completed" ? "text-blue-400" : "text-amber-400"
                }`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-[11px] text-muted truncate">{agent.task}</p>
            </div>
            <span className="text-[10px] text-muted flex-shrink-0">{agent.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
