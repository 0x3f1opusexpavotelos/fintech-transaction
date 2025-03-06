"use client"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import qs from "query-string"
import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { Suspense } from "react"
export const AccountFilter = () => {
  const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts()
  const { isLoading: isLoadingSummary } = useGetSummary()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const accountId = searchParams.get("accountId") ?? "all"
  const to = searchParams.get("from") ?? ""
  const from = searchParams.get("to") ?? ""

  const handleAccountChange = (newValue: string) => {
    const query = {
      accountId: newValue === "all" ? "" : newValue,
      from,
      to
    }

    const url = qs.stringifyUrl(
      {
        query,
        url: pathname
      },
      { skipEmptyString: true, skipNull: true }
    )

    router.push(url)
  }

  return (
    <Suspense>
      <Select
        value={accountId}
        onValueChange={handleAccountChange}
        disabled={isLoadingSummary || isLoadingAccounts}
      >
        <SelectTrigger
          className="transaction outline-none focus:ring-offset-0 focus:ring-transparent border-none
        text-white bg-white/10 hover:bg-white/20 active:bg-white/30
        h-9 rounderd-md px-3 w-full lg:w-auto
    "
        >
          <SelectValue placeholder="Account" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {accounts?.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Suspense>
  )
}
