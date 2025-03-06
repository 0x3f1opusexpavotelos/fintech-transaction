import { ChartTooltip } from "@/components/chart-tooltip"
import { format } from "date-fns"
import {
  // Tooltip,
  XAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
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

export const BarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={true}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Tooltip content={ChartTooltip}></Tooltip>

        <Bar dataKey="income" fill="#82ca9d" className="drop-shadow-sm" />
        <Bar dataKey="expenses" fill="#f43f5e" className="drop-shadow-sm" />
      </BarChart>
    </ResponsiveContainer>
  )
}
