import { FALLBACK_PRICES } from '../../data/constants';
import { fmtUSD, formatPrice } from '../../utils/formatters';

export const AssetCard = ({ symbol, data, color, holdings, prices }) => {
  // Get 24h price data
  const priceData = prices[symbol] || {};
  const currentPrice = priceData.current || FALLBACK_PRICES[symbol] || 0;
  const change24h = priceData.change24h || 0;
  const price24hAgo = priceData.price24hAgo || currentPrice;
  
  // 24h change styling
  const changeColor = change24h >= 0 ? 'text-green-400' : 'text-red-400';
  const changeBgColor = change24h >= 0 ? 'bg-green-400/10' : 'bg-red-400/10';
  const changeIcon = change24h >= 0 ? '↗' : '↘';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-slate-700/30" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-lg">{symbol}</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-lg">{symbol}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {holdings.toFixed(symbol === 'BTC' ? 8 : 6)}
              </p>
            </div>
          </div>
          
          {/* 24h Change Badge */}
          <div className={`px-3 py-1 rounded-full ${changeBgColor} ${changeColor} text-sm font-medium flex items-center gap-1`}>
            <span>{changeIcon}</span>
            <span>{Math.abs(change24h).toFixed(2)}%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Current Value</span>
            <span className="font-semibold text-slate-900 dark:text-white">${fmtUSD(data.currentValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">P/L</span>
            <span className={`font-bold ${data.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {data.profit >= 0 ? "+" : ""}${fmtUSD(data.profit)}
            </span>
          </div>
          
          {/* 24h Price Information */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">Current Price</span>
              <span className="text-slate-900 dark:text-white font-medium">
                ${formatPrice(currentPrice, currentPrice < 1)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-500 dark:text-slate-400">24h Ago</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                ${formatPrice(price24hAgo, price24hAgo < 1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};