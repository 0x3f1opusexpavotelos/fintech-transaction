import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ChartTooltip = ({ active, payload }: any) => {
  if (!active) return null

  const date = payload[0].payload.date

  const income = payload[0].value
  const expense = payload[1].value

  //   const date = console.log({
  //     active,
  //     payload,
  //     label
  //   })
  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
        {format(date, "MMM dd, yyyy")}
      </div>
      <Separator></Separator>

      <div className="space-y-1 p-2 px-3">
        <div className="flex flex-row justify-between items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <div className="rounded-full size-1.5 bg-emerald-500"></div>
            <p className="text-sm text-muted-foreground">income</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(income)}
          </p>
        </div>
        <div className="flex flex-row justify-between items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <div className="rounded-full size-1.5 bg-rose-500"></div>
            <p className="text-sm text-muted-foreground">expenses</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(expense * -1)}
          </p>
        </div>
      </div>
    </div>
  )
}
