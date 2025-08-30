import { useState, useEffect } from 'react';
import { CG_IDS, FALLBACK_PRICES } from '../data/constants';

export const useCryptoPrices = () => {
  const [prices, setPrices] = useState({});
  const [priceStatus, setPriceStatus] = useState("Live");

  useEffect(() => {
    let cancelled = false;
    
    const fetchPrices = async () => {
      try {
        const ids = Object.values(CG_IDS).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        
        const next = {};
        Object.entries(CG_IDS).forEach(([symbol, cgId]) => {
          if (data[cgId]) {
            const currentPrice = data[cgId].usd;
            const change24h = data[cgId].usd_24h_change || 0;
            const price24hAgo = currentPrice / (1 + (change24h / 100));
            
            next[symbol] = {
              current: currentPrice,
              change24h: change24h,
              price24hAgo: price24hAgo
            };
          } else {
            next[symbol] = {
              current: FALLBACK_PRICES[symbol],
              change24h: 0,
              price24hAgo: FALLBACK_PRICES[symbol]
            };
          }
        });
        
        setPrices(next);
        setPriceStatus("Live");
      } catch (error) {
        const fallbackData = {};
        Object.keys(CG_IDS).forEach(symbol => {
          fallbackData[symbol] = {
            current: FALLBACK_PRICES[symbol],
            change24h: 0,
            price24hAgo: FALLBACK_PRICES[symbol]
          };
        });
        setPrices(fallbackData);
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

  return { prices, priceStatus };
};