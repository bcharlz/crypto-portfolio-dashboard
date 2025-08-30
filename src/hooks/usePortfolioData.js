import { useMemo } from 'react';
import { rawTransactions } from '../data/transactions';
import { FALLBACK_PRICES } from '../data/constants';

export const usePortfolioData = (prices) => {
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
      return sum + amt * (prices[sym]?.current ?? FALLBACK_PRICES[sym] ?? 0);
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
  const returnPct = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(2) : "0.00";

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
      const curValue = (currentHoldings[sym] || 0) * (prices[sym]?.current || FALLBACK_PRICES[sym] || 0);
      const profit = curValue - netInvested;
      const pct = netInvested ? ((profit / netInvested) * 100).toFixed(2) : "0.00";
      return [sym, { invested: netInvested, currentValue: curValue, profit, pct }];
    });
    return Object.fromEntries(defs);
  }, [currentHoldings, prices]);

  const allocationData = useMemo(() => {
    const total = portfolioValue || 1;
    const entries = Object.entries(currentHoldings).map(([sym, amt]) => {
      const value = sym === "USD" ? amt : amt * (prices[sym]?.current ?? FALLBACK_PRICES[sym] ?? 0);
      return {
        name: sym,
        value,
        pct: ((value / total) * 100).toFixed(1),
      };
    });
    return entries.filter((e) => e.value > 0);
  }, [currentHoldings, prices, portfolioValue]);

  const timelineData = useMemo(() => {
    return rawTransactions.map((t) => {
      const valueNow =
        t.btcBalance * (prices.BTC?.current || FALLBACK_PRICES.BTC || 0) +
        t.ethBalance * (prices.ETH?.current || FALLBACK_PRICES.ETH || 0) +
        t.linkBalance * (prices.LINK?.current || FALLBACK_PRICES.LINK || 0) +
        t.dogeBalance * (prices.DOGE?.current || FALLBACK_PRICES.DOGE || 0) +
        t.xrpBalance * (prices.XRP?.current || FALLBACK_PRICES.XRP || 0) +
        t.usdBalance;
      return {
        date: t.date,
        portfolio: valueNow,
        BTC: t.btcBalance * (prices.BTC?.current || FALLBACK_PRICES.BTC || 0),
        ETH: t.ethBalance * (prices.ETH?.current || FALLBACK_PRICES.ETH || 0),
        LINK: t.linkBalance * (prices.LINK?.current || FALLBACK_PRICES.LINK || 0),
        DOGE: t.dogeBalance * (prices.DOGE?.current || FALLBACK_PRICES.DOGE || 0),
        XRP: t.xrpBalance * (prices.XRP?.current || FALLBACK_PRICES.XRP || 0),
        USD: t.usdBalance,
      };
    });
  }, [prices]);

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

  return {
    currentHoldings,
    portfolioValue,
    totalInvested,
    totalFees,
    totalReturn,
    returnPct,
    assetProfits,
    allocationData,
    timelineData,
    tradingActivity
  };
};