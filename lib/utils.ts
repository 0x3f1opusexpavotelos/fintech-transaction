import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000)
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(value)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const currencies = {
  US: {
    name: "usd",
    label: "United States Dollar",
    ticker: "USD", // or abbreviation
    symbol: "$" // &#36;
  },
  GP: {
    name: "euro",
    label: "Euro Member Countries",
    ticker: "EUR",
    symbol: "€" // &#8364;
  },
  GG: {
    label: "United Kingdom Pound",
    name: "pound",
    ticker: "GBP",
    symbol: "£", // &pound; &#163;
    format: "0,0.00[00]"
    // "data-last-timestamp": 1741121410000
  },

  CN: {
    label: "China Yuan",
    name: "yuan",
    ticker: "CNY",
    symbol: "¥" // &#165;
  },
  JP: {
    label: "Japan Yen",
    name: "yen",
    ticker: "JPY",
    symbol: "¥" // &#165;
  }
}
//  country code,International money transfers currency code, currency symbol, currency value format
