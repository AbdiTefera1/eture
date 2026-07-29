"use client";

import { useCurrency } from "./CurrencyProvider";
import { CURRENCIES } from "@/lib/currency";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  return (
    <select
      className="mini-select"
      value={currency}
      onChange={(e) => setCurrency(e.target.value as any)}
      aria-label="Currency"
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
}
