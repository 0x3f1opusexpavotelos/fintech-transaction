"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PlaidConnect } from "@/features/plaid/components/plaid-connect"
import { PlaidDisconnect } from "@/features/plaid/components/plaid-disconnect"
import { useGetConnectedBank } from "@/features/plaid/api/use-get-connected-banks"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export const SettingsCard = () => {
  const { data: connectedBanks, isLoading: isLoadingConnectedBanks } =
    useGetConnectedBank()

  if (isLoadingConnectedBanks) {
    return (
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl line-clamp-1">
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full flex items-center justify-center">
            <Loader2 className="size-6 text-slate-300 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setttings</CardTitle>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="flex flex-col gap-y-2 lg:flex-row items-center">
          <p className="text-sm font-medium w-full "> Bank account</p>
          <div
            className={cn(
              "flex flex-row items-center justify-between",
              "lg:justify-end"
            )}
          >
            <div
              className={cn(
                "text-sm truncate",
                !connectedBanks && "text-muted-foreground"
              )}
            >
              {connectedBanks
                ? "Bank account connected"
                : "No bank account connected"}
            </div>
            {connectedBanks ? <PlaidDisconnect /> : <PlaidConnect />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
