"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { UsersFilters, UsersTable, useInfiniteUsers, useUsersQueryParams } from "@/features/users";
import { Card, CardContent, CardHeader, CardTitle, ROUTER_MAP } from "@/shared";

export default function UsersPage() {
  const router = useRouter();
  const rawParams = useUsersQueryParams();
  const params = {
    page: rawParams.page ?? 1,
    limit: rawParams.limit ?? 10,
    ...rawParams,
  };
  const { isError } = useInfiniteUsers(params);

  if (isError) return router.push(ROUTER_MAP.ERROR);

  return (
    <div className="p-6">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl">Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersFilters />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  );
}
