import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription"
import { useSubscriptionModal } from "@/features/subscriptions/hooks/use-subscription-modal"

export const usePaywall = () => {
  const subscriptionModal = useSubscriptionModal()
  const { data: subscription, isLoading: isSubscriptionLoading } =
    useGetSubscription()

  const shouldBlock = !subscription || subscription.status === "expired"

  return {
    isLoading: isSubscriptionLoading,
    shouldBlock,
    triggerPaywall: () => {
      subscriptionModal.onOpen()
    }
  }
}
