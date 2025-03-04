"use client";

import { columns } from "@/app/(dashboard)/accounts/columns";
import { DataTable } from "@/components/data-table";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import { Skeleton } from "@/components/ui/skeleton";

export const AccountPage = () => {
  const accountQuery = useGetAccounts();
  const newAccount = useNewAccount();
  const deleAccounts = useBulkDeleteAccounts();
  const accounts = accountQuery.data || [];

  const isDisabled = accountQuery.isLoading || deleAccounts.isPending;

  if (accountQuery.isLoading) {
    return (
      <Card className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full flex items-center justify-center">
            <Loader2 className="size-6 text-slate-300 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between ">
          <CardTitle className="text-2xl line-clamp-1">Account Page</CardTitle>
          <Button size="sm" onClick={newAccount.onOpen}>
            <Plus className="size-4 mr-2" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            filterKey="name"
            data={accounts}
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              deleAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
