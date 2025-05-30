"use client"
import { useMountedState } from "react-use"

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet"
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet"

import { NewCategorySheet } from "@/features/categories/components/new-category-sheet"
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet"
import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal"

export const SheetProvider = () => {
  const isMounted = useMountedState()

  if (isMounted()) return null

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewTransactionSheet />
      <EditTransactionSheet />
      <NewCategorySheet />
      <EditCategorySheet />
      <SubscriptionModal />
    </>
  )
}
