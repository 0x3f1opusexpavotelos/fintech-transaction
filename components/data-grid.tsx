"use client"
import { Suspense } from "react"
import { DataCard, DataCardLoading } from "@/components/data-card"
import { useGetSummary } from "@/features/summary/api/use-get-summary"

import { FaPiggyBank } from "react-icons/fa"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6"
import { useSearchParams } from "next/navigation"
import { formatDateRange } from "@/lib/utils"

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary()

  const params = useSearchParams()
  const to = params.get("to") ?? ""
  const from = params.get("from") ?? ""

  const dateRangeLabel = formatDateRange({
    from,
    to
  })

  if (isLoading) {
    return (
      <div className="gird grid-cols-1 gap-8 lg:grip-cols-3">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    )
  }

  return (
    <Suspense>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 pb-2 ">
        <DataCard
          title="Remaing"
          icon={FaPiggyBank}
          dateRange={dateRangeLabel}
          value={data?.remaingAmount}
          percentagChange={data?.remaingChange}
        />
        <DataCard
          title="Income"
          icon={FaArrowTrendUp}
          dateRange={dateRangeLabel}
          value={data?.incomeAmount}
          percentagChange={data?.incomeChange}
        />
        <DataCard
          title="Expense"
          icon={FaArrowTrendDown}
          dateRange={dateRangeLabel}
          value={data?.expensesAmount}
          percentagChange={data?.expensesChange}
        />
      </div>
    </Suspense>
  )
}
