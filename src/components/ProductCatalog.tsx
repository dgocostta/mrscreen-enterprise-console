interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: "Active" | "Low Stock" | "Draft";
  image: string;
}

const products: Product[] = [
  { id: "1", name: 'MR Pro 55"', sku: "MRP-55-4K", category: "Commercial Display", price: "$2,499", stock: 342, status: "Active", image: "55" },
  { id: "2", name: 'MR Ultra 65"', sku: "MRU-65-8K", category: "Premium Display", price: "$4,899", stock: 128, status: "Active", image: "65" },
  { id: "3", name: 'MR Lite 43"', sku: "MRL-43-FHD", category: "Entry Display", price: "$899", stock: 18, status: "Low Stock", image: "43" },
  { id: "4", name: 'MR Touch 75"', sku: "MRT-75-4K", category: "Interactive Display", price: "$6,299", stock: 64, status: "Active", image: "75" },
  { id: "5", name: 'MR Outdoor 55"', sku: "MRO-55-IP65", category: "Outdoor Display", price: "$3,799", stock: 0, status: "Draft", image: "OD" },
  { id: "6", name: 'MR Slim 49"', sku: "MRS-49-OLED", category: "Ultra-Thin Display", price: "$3,199", stock: 87, status: "Active", image: "49" },
];

function MonitorIcon({ label }: { label: string }) {
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
      <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
        <rect x="1" y="1" width="26" height="16" rx="2" stroke="#52525b" strokeWidth="1.2" fill="#18181b" />
        <rect x="3" y="3" width="22" height="12" rx="1" fill="#27272a" />
        <path d="M10 19h8M14 17v2" stroke="#52525b" strokeWidth="1.2" strokeLinecap="round" />
        <text x="14" y="11" textAnchor="middle" fill="#71717a" fontSize="6" fontWeight="600" fontFamily="Inter">{label}</text>
      </svg>
    </div>
  );
}

function StatusBadge({ status }: { status: Product["status"] }) {
  const styles = {
    Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Low Stock": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "Active" ? "bg-emerald-400" : status === "Low Stock" ? "bg-amber-400" : "bg-zinc-400"
      }`} />
      {status}
    </span>
  );
}

export default function ProductCatalog() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-[14px] font-bold text-white">Product Catalog</h2>
          <span className="text-[11px] font-medium text-muted bg-white/[0.04] px-2 py-0.5 rounded-md">
            {products.length} products
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-7 px-3 text-[11px] font-medium text-muted-fg bg-white/[0.04] border border-border rounded-lg hover:bg-white/[0.06] transition-colors flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 3h8M4 6h4M5 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Filter
          </button>
          <button className="h-7 px-3 text-[11px] font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors">
            + Add Product
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-muted uppercase tracking-wider">Product</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted uppercase tracking-wider">Category</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted uppercase tracking-wider">Price</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted uppercase tracking-wider">Stock</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-2.5 text-[10px] font-semibold text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr
                key={product.id}
                className={`border-b border-border/50 hover:bg-white/[0.02] transition-colors ${
                  i === products.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <MonitorIcon label={product.image} />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-white">{product.name}</span>
                      <span className="text-[10px] font-medium text-muted">{product.sku}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] font-medium text-muted-fg">{product.category}</td>
                <td className="px-4 py-3 text-[13px] font-semibold text-white text-right">{product.price}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-[12px] font-medium ${product.stock <= 20 ? "text-amber-400" : "text-muted-fg"}`}>
                    {product.stock.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="w-7 h-7 inline-flex items-center justify-center rounded-md hover:bg-white/[0.06] transition-colors text-muted">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="3" r="1" fill="currentColor" />
                      <circle cx="7" cy="7" r="1" fill="currentColor" />
                      <circle cx="7" cy="11" r="1" fill="currentColor" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
