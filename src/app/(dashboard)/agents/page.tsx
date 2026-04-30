export default function AgentsPage() {
  return (
    <div>
      <h2 className="text-[20px] font-bold text-white">Agent Configuration</h2>
      <p className="text-[13px] text-muted mt-1">Configure AI agents for copywriting, lead qualification, and platform monitoring.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <span className="text-[24px]">??</span>
          <h3 className="text-[14px] font-semibold text-white mt-3">Copywriting Agent</h3>
          <p className="text-[11px] text-muted mt-1">Auto-generates product descriptions, marketing copy, and sales page content.</p>
          <span className="inline-block mt-3 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">Coming Soon</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <span className="text-[24px]">??</span>
          <h3 className="text-[14px] font-semibold text-white mt-3">Lead Qualifier</h3>
          <p className="text-[11px] text-muted mt-1">Auto-responds to enquiries, qualifies leads, and routes to you.</p>
          <span className="inline-block mt-3 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">Coming Soon</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <span className="text-[24px]">??</span>
          <h3 className="text-[14px] font-semibold text-white mt-3">Platform Monitor</h3>
          <p className="text-[11px] text-muted mt-1">Watches eBay, Adverts, DoneDeal for comments, questions, and activity.</p>
          <span className="inline-block mt-3 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}
