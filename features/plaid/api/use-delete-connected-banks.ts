import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
export const useDeleteConnectedBanks = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await client.api.plaid["connected-banks"]["$delete"]()

      if (!response.ok) {
        throw new Error("Failed to delete connected bank")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Connected bank delete")
      queryClient.invalidateQueries({ queryKey: ["connected-bank"] })
      queryClient.invalidateQueries({ queryKey: ["summary"] })
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: () => {
      toast.error("Failed to delete connected bank")
    }
  })
  return mutation
}
