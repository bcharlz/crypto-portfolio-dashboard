export const fmtUSD = (n) =>
    typeof n === "number"
      ? n.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : "--";
  
  export const formatCompact = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toFixed(0);
  };
  
  export const formatPrice = (price, isSmall = false) => {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: isSmall && price < 1 ? 6 : 2 
    });
  };