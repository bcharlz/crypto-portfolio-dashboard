import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export const StatCard = ({ title, value, change, icon: Icon, gradient, highlight = false }) => (
  <div className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${gradient} p-6 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${highlight ? 'ring-2 ring-blue-400/50' : ''}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
        {typeof change === "number" && !Number.isNaN(change) && (
          <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${change >= 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
            {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {change >= 0 ? "+" : ""}{change}%
          </div>
        )}
      </div>
    </div>
  </div>
);