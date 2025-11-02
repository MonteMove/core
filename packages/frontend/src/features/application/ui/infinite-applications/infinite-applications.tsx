"use client";

import React, { Fragment, useMemo } from "react";

import { useRouter } from "next/navigation";

import { Copy, Pencil, Trash } from "lucide-react";

import {
  CardApplication,
  useApplicationsQueryParams,
  useCopyApplication,
  useDeleteApplication,
  useInfiniteApplications,
  useUpdateApplication,
  useUpdateStatusApplication,
} from /* useUpdateStatusApplication, */ "@/entities/application";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/shared";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared";
import { Skeleton } from "@/shared";
import { ROUTER_MAP } from "@/shared";
import { useLastItemObserver } from "@/shared/lib/hooks/use-last-Item-observer";

export const InfiniteApplicationsList = () => {
  const router = useRouter();
  const params = useApplicationsQueryParams();
  const {
    data: infiniteData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteApplications(params);

  const { mutate: deleteApplicationMutation } = useDeleteApplication(params);
  const { mutate: updateStatuseApplicationMutation } = useUpdateStatusApplication();
  const { copyApplication } = useCopyApplication();

  const applications = useMemo(
    () => infiniteData?.pages.flatMap((page) => page.applications) || [],
    [infiniteData]
  );

  const lastApplicationRef = useLastItemObserver<HTMLDivElement>(
    fetchNextPage,
    isLoading,
    hasNextPage
  );

  return (
    <Fragment>
      {isLoading ? (
        [...Array(10)].map((_, i) => (
          <Card key={i} className="w-full h-full p-0 min-h-32 max-w-5xl mx-auto my-4">
            <Skeleton className="w-full h-full min-h-32 rounded-xl min-w-full" />
          </Card>
        ))
      ) : applications.length === 0 ? (
        <Card className="w-full max-w-5xl mx-auto px-2 my-4  min-[500px]:px-5">
          <CardContent className="text-center py-8 ">Заявки не найдены</CardContent>
        </Card>
      ) : (
        applications.map((app, index) => {
          const isLast = index === applications.length - 1;
          return (
            <DropdownMenu key={app.id}>
              <DropdownMenuTrigger asChild>
                <div ref={isLast ? lastApplicationRef : null}>
                  <CardApplication application={app} />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="center"
                className="w-40 bg-background shadow-md rounded-md text-foreground"
              >
                <DropdownMenuItem
                  className="hover:bg-primary/60 dark:hover:bg-primary/60"
                  onClick={() =>
                    updateStatuseApplicationMutation({
                      id: app.id.toString(),
                      status: app.status == "done" ? "open" : "done",
                    })
                  }
                >
                  <Pencil className="mr-2 h-4 w-4 text-primary" />{" "}
                  {app.status == "done" ? "В работе" : "Завершить"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-primary/60 dark:hover:bg-primary/60"
                  onClick={() => router.push(ROUTER_MAP.APPLICATIONS_EDIT + "/" + app.id)}
                >
                  <Pencil className="mr-2 h-4 w-4 text-primary" /> Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-primary/60 dark:hover:bg-primary/60"
                  onClick={() => copyApplication(app)}
                >
                  <Copy className="mr-2 h-4 w-4 text-primary" /> Копировать
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive/60 hover:text-destructive! hover:bg-destructive dark:hover:bg-destructive"
                  onClick={() => deleteApplicationMutation(app.id)}
                >
                  <Trash className="mr-2 h-4 w-4 text-destructive/60" /> Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })
      )}
    </Fragment>
  );
};
