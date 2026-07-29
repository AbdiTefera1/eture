"use client";

import { useCurrency } from "./CurrencyProvider";
import { formatMoney } from "@/lib/currency";

export default function HotelPrice({ amountUSD }: { amountUSD: number }) {
  const { currency } = useCurrency();
  return <>{formatMoney(amountUSD, currency)}</>;
}
