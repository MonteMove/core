"use client";

import React, { Fragment, useMemo, useState } from "react";

import { useBlockUser } from "@/features/users/hooks/use-block-user";
import { useDeleteUser } from "@/features/users/hooks/use-delete-user";
import { useInfiniteUsers } from "@/features/users/hooks/use-infinite-users";
import { useUpdateUserRole } from "@/features/users/hooks/use-update-user-role";
import { useUsersQueryParams } from "@/features/users/hooks/use-users-query-param";
import { useLastItemObserver } from "@/shared/lib/hooks/use-last-Item-observer";
import { Button } from "@/shared/ui/shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/shadcn/popover";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/shadcn/table";

export const UsersTable = () => {
  const blockUserMutation = useBlockUser();
  const deleteUserMutation = useDeleteUser();
  const [openUserId, setOpenUserId] = useState<string | null>(null);
  const [rolePopoverUser, setRolePopoverUser] = useState<null | { id: string; current: string }>(
    null
  );
  const updateUserRoleMutation = useUpdateUserRole();
  const params = useUsersQueryParams();
  const safeParams = { ...params, page: params.page ?? 1, limit: params.limit ?? 100 };
  const {
    data: infiniteData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteUsers(safeParams);

  const users = useMemo(
    () => infiniteData?.pages.flatMap((page) => page.users) || [],
    [infiniteData]
  );

  const tableRow = ["Имя", "Роль", "Создан", "Статус", "Последний вход"];

  const lastUserRef = useLastItemObserver<HTMLTableRowElement>(
    () => {
      fetchNextPage();
    },
    isLoading,
    hasNextPage
  );

  return (
    <Fragment>
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {tableRow.map((h) => (
                <TableHead key={h}>{isLoading ? <Skeleton className="h-6 w-24" /> : h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(5)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Пользователей не найдено
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => {
                const isLast = index === users.length - 1;
                return (
                  <Popover
                    key={user.id}
                    open={openUserId === user.id}
                    onOpenChange={(open) => setOpenUserId(open ? user.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <TableRow
                        ref={isLast ? lastUserRef : null}
                        className="cursor-pointer hover:bg-muted/50 transition"
                        onClick={() => setOpenUserId(openUserId === user.id ? null : user.id)}
                      >
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          {user.roles && Array.isArray(user.roles) && user.roles.length > 0
                            ? user.roles.map((r) => r.name).join(", ")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
                        </TableCell>
                        <TableCell>{user.blocked ? "Заблокирован" : "Активен"}</TableCell>
                        <TableCell>
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "Не был в сети"}
                        </TableCell>
                      </TableRow>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-48 p-0 z-50">
                      <div className="flex flex-col divide-y">
                        <Button
                          variant="ghost"
                          className="justify-start"
                          disabled={blockUserMutation.isPending}
                          onClick={(e) => {
                            e.stopPropagation();
                            blockUserMutation.mutate({ id: user.id, blocked: !user.blocked });
                            setOpenUserId(null);
                          }}
                        >
                          {user.blocked ? "Разблокировать" : "Заблокировать"}
                        </Button>
                        <Popover
                          open={!!rolePopoverUser && rolePopoverUser.id === user.id}
                          onOpenChange={(open) => {
                            if (!open) setRolePopoverUser(null);
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              className="justify-start"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRolePopoverUser({
                                  id: user.id,
                                  current: user.roles?.[0]?.code || "user",
                                });
                              }}
                            >
                              Обновить роль
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-56 p-4 z-50">
                            <div className="flex flex-col gap-3">
                              <div className="font-medium mb-1">Выберите роль:</div>
                              {[
                                { value: "admin", label: "Админ" },
                                { value: "moderator", label: "Модератор" },
                                { value: "holder", label: "Холдер" },
                                { value: "courier", label: "Курьер" },
                                { value: "user", label: "Пользователь" },
                              ].map((role) => (
                                <label
                                  key={role.value}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name={`user-role-${user.id}`}
                                    value={role.value}
                                    checked={rolePopoverUser?.current === role.value}
                                    onChange={() =>
                                      setRolePopoverUser(
                                        (prev) => prev && { ...prev, current: role.value }
                                      )
                                    }
                                  />
                                  <span>{role.label}</span>
                                </label>
                              ))}
                              <div className="flex gap-2 mt-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setRolePopoverUser(null)}
                                >
                                  Отмена
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={updateUserRoleMutation.isPending}
                                  onClick={() => {
                                    if (rolePopoverUser) {
                                      updateUserRoleMutation.mutate({
                                        id: user.id,
                                        roleCodes: [rolePopoverUser.current],
                                      });
                                    }
                                    setRolePopoverUser(null);
                                    setOpenUserId(null);
                                  }}
                                >
                                  {updateUserRoleMutation.isPending ? "Сохраняем..." : "Сохранить"}
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Button
                          variant="ghost"
                          className="justify-start text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUserMutation.mutate({ id: user.id });
                            setOpenUserId(null);
                          }}
                        >
                          Удалить пользователя
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Fragment>
  );
};
