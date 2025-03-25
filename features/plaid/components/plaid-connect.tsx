"use client"
import { Button } from "@/components/ui/button"
import { useCreateLinkToken } from "@/features/plaid/api/use-create-link-token"

import { useMount } from "react-use"
import { useState } from "react"
import { usePlaidLink } from "react-plaid-link"
import { useExchangePublictoken } from "@/features/plaid/api/use-exchange-token"

export const PlaidConnect = () => {
  const [token, setToken] = useState<string | null>(null)

  const createLinkToken = useCreateLinkToken()

  const exchangePublicToken = useExchangePublictoken()

  useMount(() => {
    createLinkToken.mutate(undefined, {
      onSuccess: ({ data }: { [data: string]: string }) => {
        console.log(data, "Token")
        setToken(data)
      }
    })
  })

  const plaid = usePlaidLink({
    env: process.env.PLAID_ENV!,
    token: token,
    onSuccess: (publicToken) => {
      // get exchange token / authorization code /ticket
      console.log({ publicToken })
      exchangePublicToken.mutate({
        publicToken
      })
    }
  })
  const onClick = () => {
    if (plaid.ready) {
      plaid.open()
    }
  }

  const isDisabled = !plaid.ready || exchangePublicToken.isPending

  return (
    <Button disabled={isDisabled} onClick={onClick} size="sm" variant="ghost">
      Connect
    </Button>
  )
}
