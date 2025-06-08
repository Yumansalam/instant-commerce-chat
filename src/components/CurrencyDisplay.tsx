
import React from 'react';

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
  GHS: '₵',
  ZAR: 'R',
  KES: 'KSh',
  JPY: '¥',
  CNY: '¥',
  INR: '₹'
};

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ amount, currency }) => {
  const symbol = currencySymbols[currency] || currency;
  
  return (
    <span>
      {symbol}{amount.toFixed(2)}
    </span>
  );
};
