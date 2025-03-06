import { AccountFilter } from "@/components/account-filter"
import { DateFilter } from "@/components/date-filter"
import { Suspense } from "react"

export const Filters = () => {
  return (
    <Suspense>
      <div className="mt-2 flex items-center gap-y-2 lg:flex-row lg:gap-x-2">
        <AccountFilter />
        <DateFilter />
      </div>
    </Suspense>
  )
}
