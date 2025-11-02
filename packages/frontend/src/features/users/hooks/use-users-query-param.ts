import { useMemo } from "react";

import { useSearchParams } from "next/navigation";

import { GetUsersParams } from "@/entities/users/model/user-schemas";

export function useUsersQueryParams(): Partial<GetUsersParams> {
  const searchParams = useSearchParams();

  const sortField = searchParams.get("sortField") ?? undefined;
  const sortOrder = searchParams.get("sortOrder") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const blocked =
    searchParams.get("blocked") !== null ? searchParams.get("blocked") === "true" : undefined;
  const telegramNotifications =
    searchParams.get("telegramNotifications") !== null
      ? searchParams.get("telegramNotifications") === "true"
      : undefined;
  const roleCode = searchParams.get("roleCode") ?? undefined;
  const telegramId = searchParams.get("telegramId") ?? undefined;
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const page = pageParam ? Number(pageParam) : 1;
  const limit = limitParam ? Number(limitParam) : 100;

  return useMemo(() => {
    const params: Partial<GetUsersParams> = {
      page,
      limit,
    };
    if (search) params.search = search;
    if (sortField) params.sortField = sortField as GetUsersParams["sortField"];
    if (sortOrder) params.sortOrder = sortOrder as GetUsersParams["sortOrder"];
    if (blocked !== undefined) params.blocked = blocked;
    if (telegramNotifications !== undefined) params.telegramNotifications = telegramNotifications;
    if (roleCode) params.roleCode = roleCode as GetUsersParams["roleCode"];
    if (telegramId) params.telegramId = telegramId;
    return params;
  }, [
    search,
    sortField,
    sortOrder,
    blocked,
    telegramNotifications,
    roleCode,
    telegramId,
    page,
    limit,
  ]);
}
