"use client"
import { Button } from "@/components/ui/button"
import { useDeleteConnectedBanks } from "@/features/plaid/api/use-delete-connected-banks"
import { useConfirm } from "@/hooks/use-confirm"

export const PlaidDisconnect = () => {
  const [Dialog, confirm] = useConfirm(
    "Are you sure?",
    "This will disconnect  your bank account, and remove all associated data "
  )
  const deleteConnectedBanks = useDeleteConnectedBanks()
  const onClick = async () => {
    const ok = await confirm()

    if (ok) {
      deleteConnectedBanks.mutate()
    }
  }

  return (
    <>
      <Dialog />
      <Button
        disabled={deleteConnectedBanks.isPending}
        onClick={onClick}
        size="sm"
        variant="ghost"
      >
        Disconnect
      </Button>
    </>
  )
}
