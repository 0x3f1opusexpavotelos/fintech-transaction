import { clsx, type ClassValue } from "clsx"
import { eachDayOfInterval, isSameDay, subDays, format } from "date-fns"
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

export function fillMissingDays(
  activeDays: {
    date: Date
    income: number
    expenses: number
  }[],
  startDate: Date,
  endDate: Date
) {
  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  })

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day))
    if (found) {
      return found
    } else {
      return {
        date: day,
        income: 0,
        expenses: 0
      }
    }
  })

  return transactionsByDay
}

export function caclPercentChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100
  }
  return ((current - previous) / previous) * 100
}

type Period = {
  from: string | Date
  to: string | Date
}

export function formatDateRange(period: Period) {
  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 30)

  if (!period.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd,y")}`
  }
  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(defaultTo, "LLL dd,y")}`
  }

  return format(period.from, "LLL dd, y")
}

export function formatPercentage(
  value: number,
  optons: { addPrefix?: boolean } = {
    addPrefix: false
  }
) {
  const result = new Intl.NumberFormat("en-US", {
    style: "percent"
  }).format(value / 100)

  if (optons.addPrefix && value > 0) {
    return `+${result}`
  }
  return result
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
