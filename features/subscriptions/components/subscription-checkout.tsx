import { Button } from "@/components/ui/button"
import { useCheckoutSubscription } from "@/features/subscriptions/api/use-checkout-subscription"
import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription"

export const SubscriptionCheckout = () => {
  const { data: subscription, isLoading: isLoadingSubscription } =
    useGetSubscription()
  const checkoutSubscription = useCheckoutSubscription()
  return (
    <Button
      disabled={isLoadingSubscription}
      onClick={() => checkoutSubscription.mutate()}
      variant="ghost"
      size="sm"
    >
      {subscription ? "Manage" : "upgrade"}
    </Button>
  )
}
