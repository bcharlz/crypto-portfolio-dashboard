import { DollarSign, TrendingUp, Activity, Wallet } from "lucide-react";
import { StatCard } from "../ui/StatCard";
import { AssetCard } from "../portfolio/AssetCard";
import { GRADIENT_COLORS } from "../../data/constants";
import { formatCompact } from "../../utils/formatters";

export const OverviewTab = ({ prices, portfolioData }) => {
  const { 
    portfolioValue, 
    totalInvested, 
    totalReturn, 
    totalFees,
    returnPct,
    currentHoldings,
    assetProfits 
  } = portfolioData;

  return (
    <div className="space-y-8">
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Portfolio Value" 
          value={`$${formatCompact(portfolioValue)}`} 
          change={parseFloat(returnPct)} 
          icon={DollarSign} 
          gradient="from-blue-600 via-blue-700 to-indigo-800"
          highlight={true}
        />
        <StatCard 
          title="Total Invested" 
          value={`$${formatCompact(totalInvested)}`} 
          icon={Wallet} 
          gradient="from-emerald-500 via-emerald-600 to-teal-700"
        />
        <StatCard 
          title="Total Profit" 
          value={`$${formatCompact(totalReturn)}`} 
          change={parseFloat(returnPct)} 
          icon={TrendingUp} 
          gradient="from-purple-600 via-purple-700 to-indigo-800"
        />
        <StatCard 
          title="Fees Paid" 
          value={`$${formatCompact(totalFees)}`} 
          icon={Activity} 
          gradient="from-rose-500 via-rose-600 to-pink-700"
        />
      </div>

      {/* Asset Performance */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Asset Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AssetCard 
            symbol="BTC" 
            data={assetProfits.BTC} 
            color="bg-gradient-to-br from-amber-400 to-orange-500" 
            holdings={currentHoldings.BTC}
            prices={prices}
          />
          <AssetCard 
            symbol="ETH" 
            data={assetProfits.ETH} 
            color="bg-gradient-to-br from-blue-500 to-indigo-600" 
            holdings={currentHoldings.ETH}
            prices={prices}
          />
          <AssetCard 
            symbol="XRP" 
            data={assetProfits.XRP} 
            color="bg-gradient-to-br from-purple-500 to-purple-700" 
            holdings={currentHoldings.XRP}
            prices={prices}
          />
        </div>
      </div>
    </div>
  );
};