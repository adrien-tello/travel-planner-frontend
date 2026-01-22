// Currency conversion utility
// 1 USD = 600 FCFA (approximate rate)
const USD_TO_FCFA_RATE = 600;

export const formatCurrency = (amount: number | string, currency: 'USD' | 'FCFA' = 'FCFA'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '0 FCFA';
  
  if (currency === 'FCFA') {
    return `${Math.round(numAmount).toLocaleString()} FCFA`;
  }
  
  return `$${numAmount.toLocaleString()}`;
};

export const convertUsdToFcfa = (usdAmount: number | string): number => {
  const numAmount = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
  return Math.round(numAmount * USD_TO_FCFA_RATE);
};

export const convertFcfaToUsd = (fcfaAmount: number | string): number => {
  const numAmount = typeof fcfaAmount === 'string' ? parseFloat(fcfaAmount) : fcfaAmount;
  return Math.round(numAmount / USD_TO_FCFA_RATE);
};

export const formatBudget = (amount: number | string): string => {
  const usdAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const fcfaAmount = convertUsdToFcfa(usdAmount);
  return formatCurrency(fcfaAmount, 'FCFA');
};