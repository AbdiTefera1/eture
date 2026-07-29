// Static reference rates for display purposes only (updated periodically by a
// developer, not live). For a production site handling real transactions,
// swap this for a live FX API (e.g. exchangerate.host) cached with revalidation.
// Base unit: USD.

export const CURRENCIES = ["USD", "EUR", "GBP", "ETB", "JPY", "CNY", "INR", "AED"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$", EUR: "€", GBP: "£", ETB: "Br", JPY: "¥", CNY: "¥", INR: "₹", AED: "د.إ",
};

// Approximate USD -> currency rates (reference only, as of prompt authoring).
const RATES_FROM_USD: Record<Currency, number> = {
  USD: 1, EUR: 0.92, GBP: 0.78, ETB: 123, JPY: 156, CNY: 7.2, INR: 83.5, AED: 3.67,
};

export function convertFromUSD(amountUSD: number, currency: Currency): number {
  return amountUSD * (RATES_FROM_USD[currency] ?? 1);
}

export function formatMoney(amountUSD: number, currency: Currency): string {
  const converted = convertFromUSD(amountUSD, currency);
  const symbol = CURRENCY_SYMBOLS[currency];
  const rounded = converted >= 100 ? Math.round(converted) : Math.round(converted * 100) / 100;
  return `${symbol}${rounded.toLocaleString()}`;
}
