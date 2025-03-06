import { ChartTooltip } from "@/components/chart-tooltip"
import { format } from "date-fns"
import {
  //   Tooltip,
  XAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip
} from "recharts"
type Props = {
  data: {
    date: string
    income: number
    expenses: number
  }[]
}

export const AreaVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={ChartTooltip}></Tooltip>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickMargin={16}
          tickFormatter={(value) => format(value, "dd MMM")}
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#income)"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#f43f5e"
          fillOpacity={1}
          fill="url(#expenses)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
