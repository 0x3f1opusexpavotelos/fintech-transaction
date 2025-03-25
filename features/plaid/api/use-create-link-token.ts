import { toast } from "sonner"
import { InferRequestType, InferResponseType } from "hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { client } from "@/lib/hono"

type ResponseType = InferResponseType<
  (typeof client.api.plaid)["create-link-token"]["$post"],
  200
>

export const useCreateLinkToken = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.plaid["create-link-token"].$post({
        json
      })
      if (!response.ok) {
        throw new Error("Failed to create link token")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Link token created")
    },
    onError: () => {
      toast.error("Failed to create Link token")
    }
  })

  return mutation
}
