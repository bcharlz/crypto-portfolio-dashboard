import { GRADIENT_COLORS } from "../../data/constants";
import { fmtUSD } from "../../utils/formatters";

export const ProfitsTab = ({ portfolioData }) => {
  const { 
    portfolioValue, 
    totalInvested, 
    totalReturn, 
    returnPct,
    assetProfits 
  } = portfolioData;

  return (
    <div className="space-y-8">
      {/* Hero profit section */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-white bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative">
          <h2 className="text-4xl font-black mb-6">Portfolio Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-white/80 text-sm uppercase tracking-wider mb-2">Total Invested</p>
              <p className="text-3xl font-bold">${fmtUSD(totalInvested)}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm uppercase tracking-wider mb-2">Current Value</p>
              <p className="text-3xl font-bold">${fmtUSD(portfolioValue)}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm uppercase tracking-wider mb-2">Total Profit</p>
              <p className="text-5xl font-black text-yellow-300">
                {totalReturn >= 0 ? "+" : ""}${fmtUSD(totalReturn)}
              </p>
              <p className="text-xl font-semibold text-white/90">{totalReturn >= 0 ? "+" : ""}{returnPct}% ROI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset profits */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Profit Breakdown by Asset</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["BTC", "ETH", "XRP", "LINK", "DOGE"].map((sym) => {
            const data = assetProfits[sym];
            
            return (
              <div key={sym} className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${GRADIENT_COLORS[sym]} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">{sym}</span>
                    </div>
                    <span className="font-bold text-xl">{sym}</span>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-sm font-bold ${data.profit >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"}`}>
                    {data.profit >= 0 ? "+" : ""}{data.pct}%
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Invested</span>
                    <span className="font-semibold">${fmtUSD(data.invested)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Current Value</span>
                    <span className="font-semibold">${fmtUSD(data.currentValue)}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between">
                    <span className="font-bold">P/L</span>
                    <span className={`font-bold text-lg ${data.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {data.profit >= 0 ? "+" : ""}${fmtUSD(data.profit)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};