import React, { useEffect, useState } from "react";
import { Sun, Moon, Eye, TrendingUp, Wallet, BarChart3, Zap } from "lucide-react";
import { useCryptoPrices } from "../hooks/useCryptoPrices";
import { usePortfolioData } from "../hooks/usePortfolioData";
import { OverviewTab } from "./tabs/OverviewTab";
import { ProfitsTab } from "./tabs/ProfitsTab";
import { HoldingsTab } from "./tabs/HoldingsTab";
import { TimelineTab } from "./tabs/TimelineTab";
import { TradingTab } from "./tabs/TradingTab";

const CryptoPortfolioDashboard = () => {
  const [dark, setDark] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { prices, priceStatus } = useCryptoPrices();
  const portfolioData = usePortfolioData(prices);

  // Enable Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    return () => root.classList.remove("dark");
  }, [dark]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye, component: OverviewTab },
    { id: "profits", label: "Profits", icon: TrendingUp, component: ProfitsTab },
    { id: "holdings", label: "Holdings", icon: Wallet, component: HoldingsTab },
    { id: "timeline", label: "Timeline", icon: BarChart3, component: TimelineTab },
    { id: "trading", label: "Activity", icon: Zap, component: TradingTab },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

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
          {tabs.map((t) => (
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
        {ActiveComponent && (
          <ActiveComponent 
            prices={prices}
            portfolioData={portfolioData}
          />
        )}
      </div>
    </div>
  );
};

export default CryptoPortfolioDashboard;