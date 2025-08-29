import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, CartesianGrid, Tooltip, XAxis, YAxis,
  BarChart, Bar, LineChart, Line
} from "recharts";
import {
  DollarSign, TrendingUp, TrendingDown, Activity, Wallet, Sun, Moon,
  ArrowUpRight, ArrowDownRight, Eye, Target, Zap, BarChart3
} from "lucide-react";

/** =============================
 *  COIN ID MAP (for CoinGecko)
 *  ============================= */
const CG_IDS = {
  BTC: "bitcoin",
  ETH: "ethereum",
  LINK: "chainlink",
  DOGE: "dogecoin",
  XRP: "ripple",
};

/** =============================
 *  SAFE FALLBACK PRICES (Aug 13, 2025)
 *  used if live API fails
 *  ============================= */
const FALLBACK_PRICES = {
  BTC: 122654.88,
  ETH: 4755.27,
  LINK: 23.97,
  DOGE: 0.2467,
  XRP: 3.27,
};

/** =============================
 *  RAW TRANSACTIONS (UNCHANGED)
 *  Keep this whole block intact
 *  ============================= */
const rawTransactions = [
  { date: '2021-01-08', type: 'Buy',   symbol: 'BTCUSD',  usdAmount: -1015,    fee: 0,       btcBalance: 0.02456458, ethBalance: 0,        linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 0 },
  { date: '2021-01-10', type: 'Credit',symbol: 'USD',     usdAmount: 500,      fee: 0,       btcBalance: 0.02456458, ethBalance: 0,        linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 500 },
  { date: '2021-01-10', type: 'Buy',   symbol: 'ETHUSD',  usdAmount: -482.7,   fee: 7.3,     btcBalance: 0.02456458, ethBalance: 0.363405, linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 10 },
  { date: '2021-01-19', type: 'Credit',symbol: 'USD',     usdAmount: 867.52,   fee: 0,       btcBalance: 0.02456458, ethBalance: 0.363405, linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 877.52 },
  { date: '2021-01-19', type: 'Credit',symbol: 'USD',     usdAmount: 1376,     fee: 0,       btcBalance: 0.02456458, ethBalance: 0.363405, linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 2253.52 },
  { date: '2021-01-19', type: 'Buy',   symbol: 'ETHUSD',  usdAmount: -1355.5,  fee: 20.5,    btcBalance: 0.02456458, ethBalance: 1.344485, linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 877.52 },
  { date: '2021-02-22', type: 'Credit',symbol: 'USD',     usdAmount: 5000,     fee: 0,       btcBalance: 0.02456458, ethBalance: 1.344485, linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 5877.52 },
  { date: '2021-02-22', type: 'Buy',   symbol: 'ETHUSD',  usdAmount: -4925.5,  fee: 74.5,    btcBalance: 0.02456458, ethBalance: 4.06738,  linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 877.52 },
  { date: '2021-04-28', type: 'Credit',symbol: 'USD',     usdAmount: 1750,     fee: 0,       btcBalance: 0.02456458, ethBalance: 4.06738,  linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 2627.52 },
  { date: '2021-04-28', type: 'Buy',   symbol: 'ETHUSD',  usdAmount: -2551.41, fee: 38.59,   btcBalance: 0.02456458, ethBalance: 5.048559, linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 37.52 },
  { date: '2021-05-06', type: 'Credit',symbol: 'USD',     usdAmount: 1000,     fee: 0,       btcBalance: 0.02456458, ethBalance: 5.048559, linkBalance: 0,         dogeBalance: 0,         xrpBalance: 0,         usdBalance: 1037.52 },
  { date: '2021-05-06', type: 'Buy',   symbol: 'DOGEUSD', usdAmount: -1000,    fee: 0,       btcBalance: 0.02456458, ethBalance: 5.048559, linkBalance: 0,         dogeBalance: 1568.430628,xrpBalance: 0,         usdBalance: 37.52 },
  { date: '2021-05-06', type: 'Buy',   symbol: 'DOGEUSD', usdAmount: -37.52,   fee: 0,       btcBalance: 0.02456458, ethBalance: 5.048559, linkBalance: 0,         dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 0 },
  { date: '2021-05-15', type: 'Credit',symbol: 'USD',     usdAmount: 20000,    fee: 0,       btcBalance: 0.02456458, ethBalance: 5.048559, linkBalance: 0,         dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 20000 },
  { date: '2021-05-17', type: 'Buy',   symbol: 'ETHUSD',  usdAmount: -13791.4, fee: 208.6,   btcBalance: 0.02456458, ethBalance: 9.053739, linkBalance: 0,         dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 6000 },
  { date: '2021-05-20', type: 'Credit',symbol: 'USD',     usdAmount: 25000,    fee: 0,       btcBalance: 0.02456458, ethBalance: 9.053739, linkBalance: 0,         dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 31000 },
  { date: '2021-05-20', type: 'Sell',  symbol: 'ETHUSD',  usdAmount: 10991.12, fee: 163.77,  btcBalance: 0.02456458, ethBalance: 5.053739, linkBalance: 0,         dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 41827.35 },
  { date: '2021-05-20', type: 'Buy',   symbol: 'BTCUSD',  usdAmount: -39650.27,fee: 599.73,  btcBalance: 1.00362057, ethBalance: 5.053739, linkBalance: 0,         dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 1577.35 },
  { date: '2021-05-24', type: 'Buy',   symbol: 'LINKUSD', usdAmount: -1477.65, fee: 22.35,   btcBalance: 1.00362057, ethBalance: 5.053739, linkBalance: 63.557381,  dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 77.35 },
  { date: '2021-12-07', type: 'Credit',symbol: 'USD',     usdAmount: 25000,    fee: 0,       btcBalance: 1.00362057, ethBalance: 5.053739, linkBalance: 63.557381,  dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 25077.35 },
  { date: '2021-12-30', type: 'Buy',   symbol: 'ETHUSD',  usdAmount: -22657.3, fee: 342.7,   btcBalance: 1.00362057, ethBalance: 11.12844, linkBalance: 63.557381,   dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 2077.35 },
  { date: '2022-01-11', type: 'Buy',   symbol: 'ETHUSD',  usdAmount: -1970.2,  fee: 29.8,    btcBalance: 1.00362057, ethBalance: 11.75301, linkBalance: 63.557381,  dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 77.35 },
  { date: '2024-11-21', type: 'Sell',  symbol: 'ETHBTC',  usdAmount: 0,        fee: 0,       btcBalance: 1.02692449, ethBalance: 11.00941, linkBalance: 63.557381,  dogeBalance: 1627.035482,xrpBalance: 0,         usdBalance: 77.35 },
  { date: '2024-11-22', type: 'Debit', symbol: 'DOGE',    usdAmount: 0,        fee: 0.2208,  btcBalance: 1.02692449, ethBalance: 11.00941, linkBalance: 63.557381,  dogeBalance: 0,          xrpBalance: 0,         usdBalance: 77.35 },
  { date: '2024-12-13', type: 'Credit',symbol: 'USD',     usdAmount: 2500,     fee: 0,       btcBalance: 1.02692449, ethBalance: 11.00941, linkBalance: 63.557381,  dogeBalance: 0,          xrpBalance: 0,         usdBalance: 2577.35 },
  { date: '2024-12-13', type: 'Buy',   symbol: 'XRPUSD',  usdAmount: -2462.75, fee: 37.25,   btcBalance: 1.02692449, ethBalance: 11.00941, linkBalance: 63.557381,  dogeBalance: 0,          xrpBalance: 1058.496121,usdBalance: 77.35 }
];

/** =============================
 *  HELPERS
 *  ============================= */
const fmtUSD = (n) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : "--";

const formatCompact = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toFixed(0);
};

/** =============================
 *  COMPONENT
 *  ============================= */
const CryptoPortfolioDashboard = () => {
  const [dark, setDark] = useState(true);
  const [prices, setPrices] = useState(FALLBACK_PRICES);
  const [priceStatus, setPriceStatus] = useState("Live");
  const [activeTab, setActiveTab] = useState("overview");

  // Enable Tailwind dark mode (class strategy)
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    return () => root.classList.remove("dark");
  }, [dark]);

  // Fetch live prices every 60s
  useEffect(() => {
    let cancelled = false;
    const fetchPrices = async () => {
      try {
        const ids = Object.values(CG_IDS).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const next = {
          BTC: data[CG_IDS.BTC]?.usd ?? FALLBACK_PRICES.BTC,
          ETH: data[CG_IDS.ETH]?.usd ?? FALLBACK_PRICES.ETH,
          LINK: data[CG_IDS.LINK]?.usd ?? FALLBACK_PRICES.LINK,
          DOGE: data[CG_IDS.DOGE]?.usd ?? FALLBACK_PRICES.DOGE,
          XRP: data[CG_IDS.XRP]?.usd ?? FALLBACK_PRICES.XRP,
        };
        setPrices(next);
        setPriceStatus("Live");
      } catch {
        setPriceStatus("Fallback");
      }
    };
    fetchPrices();
    const timer = setInterval(fetchPrices, 60_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  /** =============================
   *  HOLDINGS & METRICS
   *  ============================= */
  const currentHoldings = useMemo(() => {
    const last = rawTransactions[rawTransactions.length - 1];
    return {
      BTC: last.btcBalance,
      ETH: last.ethBalance,
      LINK: last.linkBalance,
      DOGE: last.dogeBalance,
      XRP: last.xrpBalance,
      USD: last.usdBalance,
    };
  }, []);

  const portfolioValue = useMemo(() => {
    return Object.entries(currentHoldings).reduce((sum, [sym, amt]) => {
      if (sym === "USD") return sum + amt;
      return sum + amt * (prices[sym] ?? 0);
    }, 0);
  }, [currentHoldings, prices]);

  const totalInvested = useMemo(() => {
    const deposits = rawTransactions
      .filter(t => t.type === 'Credit' && t.symbol === 'USD')
      .reduce((sum, t) => sum + t.usdAmount, 0);

    const withdrawals = rawTransactions
      .filter(t =>
        t.symbol === 'USD' &&
        (t.type === 'Debit' || t.type === 'Withdrawal' || t.type === 'Transfer Out')
      )
      .reduce((sum, t) => sum + Math.abs(t.usdAmount), 0);

    return deposits - withdrawals;
  }, []);

  const totalFees = useMemo(
    () => rawTransactions.reduce((s, t) => s + (t.fee || 0), 0),
    []
  );

  const totalReturn = portfolioValue - totalInvested;
  const returnPct =
    totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(2) : "0.00";

  /** =============================
   *  PER-ASSET PROFIT
   *  ============================= */
  const getInvestedFor = (ticker) =>
    rawTransactions
      .filter((t) => t.symbol === `${ticker}USD` && t.usdAmount < 0)
      .reduce((s, t) => s + Math.abs(t.usdAmount), 0);

  const getSoldUSDFor = (ticker) =>
    rawTransactions
      .filter((t) => t.symbol === `${ticker}USD` && t.usdAmount > 0)
      .reduce((s, t) => s + t.usdAmount, 0);

  const assetProfits = useMemo(() => {
    const defs = ["BTC", "ETH", "LINK", "DOGE", "XRP"].map((sym) => {
      const invested = getInvestedFor(sym);
      const sold = getSoldUSDFor(sym);
      const netInvested = Math.max(invested - sold, 0);
      const curValue =
        (currentHoldings[sym] || 0) * (prices[sym] || FALLBACK_PRICES[sym] || 0);
      const profit = curValue - netInvested;
      const pct = netInvested ? ((profit / netInvested) * 100).toFixed(2) : "0.00";
      return [sym, { invested: netInvested, currentValue: curValue, profit, pct }];
    });
    return Object.fromEntries(defs);
  }, [currentHoldings, prices]);

  /** =============================
   *  ALLOCATION (PIE)
   *  ============================= */
  const allocationData = useMemo(() => {
    const total = portfolioValue || 1;
    const entries = Object.entries(currentHoldings).map(([sym, amt]) => {
      const value = sym === "USD" ? amt : amt * (prices[sym] || 0);
      return {
        name: sym,
        value,
        pct: ((value / total) * 100).toFixed(1),
      };
    });
    return entries.filter((e) => e.value > 0);
  }, [currentHoldings, prices, portfolioValue]);

  /** =============================
   *  TIMELINE
   *  ============================= */
  const timelineData = useMemo(() => {
    return rawTransactions.map((t) => {
      const valueNow =
        t.btcBalance * (prices.BTC || 0) +
        t.ethBalance * (prices.ETH || 0) +
        t.linkBalance * (prices.LINK || 0) +
        t.dogeBalance * (prices.DOGE || 0) +
        t.xrpBalance * (prices.XRP || 0) +
        t.usdBalance;
      return {
        date: t.date,
        portfolio: valueNow,
        BTC: t.btcBalance * (prices.BTC || 0),
        ETH: t.ethBalance * (prices.ETH || 0),
        LINK: t.linkBalance * (prices.LINK || 0),
        DOGE: t.dogeBalance * (prices.DOGE || 0),
        XRP: t.xrpBalance * (prices.XRP || 0),
        USD: t.usdBalance,
      };
    });
  }, [prices]);

  /** =============================
   *  TRADING ACTIVITY
   *  ============================= */
  const tradingActivity = useMemo(
    () =>
      rawTransactions
        .filter((t) => t.type === "Buy" || t.type === "Sell")
        .map((t) => ({
          date: t.date,
          type: t.type,
          symbol: t.symbol,
          amount: Math.abs(t.usdAmount),
          fee: t.fee || 0,
        })),
    []
  );

  /** =============================
   *  UI COMPONENTS
   *  ============================= */
  const StatCard = ({ title, value, change, icon: Icon, gradient, highlight = false }) => (
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

  const AssetCard = ({ symbol, data, color, holdings }) => (
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
              <p className="text-slate-500 dark:text-slate-400 text-sm">{holdings.toFixed(symbol === 'BTC' ? 8 : 6)}</p>
            </div>
          </div>
          <div className={`rounded-full px-3 py-1 text-sm font-semibold ${data.profit >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"}`}>
            {data.profit >= 0 ? "+" : ""}{data.pct}%
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
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 shadow-xl ${className}`}>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{title}</h3>
      {children}
    </div>
  );

  /** =============================
   *  RENDER
   *  ============================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 text-slate-900 dark:text-slate-100">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
              Crypto Portfolio
            </h1>
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
              <span>Track your investments • Jan 2021 - Present</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${priceStatus === "Live" ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                <span className="text-sm font-medium">{priceStatus} Prices</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="group rounded-2xl px-4 py-3 border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
          >
            {dark ? <Sun className="h-5 w-5 text-amber-500 group-hover:rotate-180 transition-transform duration-500" /> : <Moon className="h-5 w-5 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />}
            <span className="font-medium">{dark ? "Light" : "Dark"}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="rounded-3xl p-2 mb-8 border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-xl w-fit">
          {[
            { id: "overview", label: "Overview", icon: Eye },
            { id: "profits", label: "Profits", icon: TrendingUp },
            { id: "holdings", label: "Holdings", icon: Wallet },
            { id: "timeline", label: "Timeline", icon: BarChart3 },
            { id: "trading", label: "Activity", icon: Zap },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`group flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                activeTab === t.id 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105" 
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:scale-105"
              }`}
            >
              <t.icon className={`h-4 w-4 ${activeTab === t.id ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform duration-300`} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
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

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Portfolio Timeline */}
              <ChartCard title="Portfolio Growth Over Time">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="date" stroke="currentColor" opacity={0.6} fontSize={12} />
                    <YAxis stroke="currentColor" opacity={0.6} fontSize={12} tickFormatter={(v) => `${formatCompact(v)}`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: 'none', 
                        borderRadius: '12px', 
                        backdropFilter: 'blur(10px)' 
                      }}
                      formatter={(v) => [`${fmtUSD(v)}`, 'Portfolio Value']} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="portfolio" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      fill="url(#portfolioGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Allocation Pie */}
              <ChartCard title="Current Allocation">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={allocationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={130}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {allocationData.map((_, i) => (
                        <Cell 
                          key={i} 
                          fill={[
                            "#f59e0b", // BTC - Gold
                            "#3b82f6", // ETH - Blue
                            "#10b981", // LINK - Emerald
                            "#ef4444", // DOGE - Red
                            "#8b5cf6", // XRP - Purple
                            "#06b6d4"  // USD - Cyan
                          ][i % 6]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: 'none', 
                        borderRadius: '12px' 
                      }}
                      formatter={(v, n, p) => [`${fmtUSD(v)}`, `${p?.payload?.name} (${p?.payload?.pct}%)`]} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {allocationData.map((a, i) => (
                    <div key={a.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ 
                          backgroundColor: [
                            "#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"
                          ][i % 6] 
                        }} 
                      />
                      <div>
                        <p className="font-semibold text-sm">{a.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{a.pct}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Quick Asset Overview */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Asset Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AssetCard 
                  symbol="BTC" 
                  data={assetProfits.BTC} 
                  color="bg-gradient-to-br from-amber-400 to-orange-500" 
                  holdings={currentHoldings.BTC} 
                />
                <AssetCard 
                  symbol="ETH" 
                  data={assetProfits.ETH} 
                  color="bg-gradient-to-br from-blue-500 to-indigo-600" 
                  holdings={currentHoldings.ETH} 
                />
                <AssetCard 
                  symbol="XRP" 
                  data={assetProfits.XRP} 
                  color="bg-gradient-to-br from-purple-500 to-purple-700" 
                  holdings={currentHoldings.XRP} 
                />
              </div>
            </div>
          </div>
        )}

        {/* PROFITS TAB */}
        {activeTab === "profits" && (
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
                  const colors = {
                    BTC: "from-amber-400 to-orange-500",
                    ETH: "from-blue-500 to-indigo-600", 
                    XRP: "from-purple-500 to-purple-700",
                    LINK: "from-emerald-500 to-teal-600",
                    DOGE: "from-rose-500 to-pink-600"
                  };
                  
                  return (
                    <div key={sym} className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[sym]} flex items-center justify-center shadow-lg`}>
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
        )}

        {/* OTHER TABS - Holdings, Timeline, Trading */}
        {activeTab === "holdings" && (
          <ChartCard title="Current Holdings" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {Object.entries(currentHoldings)
                    .filter(([_, amt]) => amt > 0)
                    .map(([sym, amt]) => {
                      const price = sym === "USD" ? 1 : prices[sym] || 0;
                      const value = amt * price;
                      const alloc = portfolioValue ? ((value / portfolioValue) * 100).toFixed(1) : "0.0";
                      const colors = {
                        BTC: "bg-amber-500",
                        ETH: "bg-blue-500", 
                        XRP: "bg-purple-500",
                        LINK: "bg-emerald-500",
                        DOGE: "bg-rose-500",
                        USD: "bg-slate-500"
                      };
                      
                      return (
                        <tr key={sym} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${colors[sym]} flex items-center justify-center shadow-sm`}>
                                <span className="text-white font-bold text-sm">{sym}</span>
                              </div>
                              <span className="font-semibold text-lg">{sym}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">{sym === "USD" ? amt.toFixed(2) : amt.toFixed(6)}</td>
                          <td className="px-6 py-4 font-semibold">${fmtUSD(price)}</td>
                          <td className="px-6 py-4 font-bold text-lg">${fmtUSD(value)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${colors[sym]}`}
                                  style={{ width: `${Math.min(parseFloat(alloc), 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold w-12">{alloc}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </ChartCard>
        )}

        {activeTab === "timeline" && (
          <ChartCard title="Asset Balance Timeline" className="col-span-full">
            <ResponsiveContainer width="100%" height={450}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis dataKey="date" stroke="currentColor" opacity={0.6} fontSize={12} />
                <YAxis stroke="currentColor" opacity={0.6} fontSize={12} tickFormatter={(v) => `${formatCompact(v)}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px' 
                  }}
                  formatter={(v, n) => [`${fmtUSD(v)}`, n]} 
                />
                <Area type="monotone" dataKey="BTC" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} />
                <Area type="monotone" dataKey="ETH" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
                <Area type="monotone" dataKey="LINK" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
                <Area type="monotone" dataKey="DOGE" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
                <Area type="monotone" dataKey="XRP" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.8} />
                <Area type="monotone" dataKey="USD" stackId="1" stroke="#6b7280" fill="#6b7280" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {activeTab === "trading" && (
          <div className="space-y-8">
            <ChartCard title="Trading Volume Over Time">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={tradingActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis dataKey="date" stroke="currentColor" opacity={0.6} fontSize={12} />
                  <YAxis stroke="currentColor" opacity={0.6} fontSize={12} tickFormatter={(v) => `${formatCompact(v)}`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: 'none', 
                      borderRadius: '12px' 
                    }}
                    formatter={(v) => [`${fmtUSD(v)}`, 'Amount']} 
                  />
                  <Bar dataKey="amount" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Transaction History" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Symbol</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount (USD)</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {rawTransactions
                      .slice()
                      .reverse()
                      .map((t, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-mono">{t.date}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
                                t.type === "Buy"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                  : t.type === "Sell"
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                                  : t.type === "Credit"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300"
                              }`}
                            >
                              {t.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold">{t.symbol}</td>
                          <td className="px-6 py-4 font-mono">${fmtUSD(Math.abs(t.usdAmount))}</td>
                          <td className="px-6 py-4 font-mono text-slate-500">${(t.fee || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoPortfolioDashboard;
