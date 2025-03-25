import { toast } from "sonner"
import { InferRequestType, InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<
  (typeof client.api.plaid)["exchange-public-token"]["$post"],
  200
>

type RequestType = InferRequestType<
  (typeof client.api.plaid)["exchange-public-token"]["$post"]
>["json"]

export const useExchangePublictoken = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.plaid["exchange-public-token"].$post({
        json
      })
      if (!response.ok) {
        throw new Error("Failed to create link token")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Link token created")
      // invalidate following
    },
    onError: () => {
      toast.error("Failed to create Link token")
    }
  })

  return mutation
}
