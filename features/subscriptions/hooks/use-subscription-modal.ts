import { create } from "zustand"

type subscriptionModalState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useSubscriptionModal = create<subscriptionModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))
