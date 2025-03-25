import { client } from "@/lib/hono"
import { useQuery } from "@tanstack/react-query"

export const useGetConnectedBank = () => {
  const query = useQuery({
    queryKey: ["connected-banks"],
    queryFn: async () => {
      const response = await client.api.plaid["connected-banks"].$get()

      if (!response.ok) {
        throw new Error("Failed to fetch connected bank")
      }
      const { data } = await response.json()
      return data
    }
  })

  return query
}
