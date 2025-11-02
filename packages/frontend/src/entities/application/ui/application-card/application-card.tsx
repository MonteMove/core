"use client";

import React from "react";

import { Copy } from "lucide-react";

import { copyHandler } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/shadcn/badge";
import { Button } from "@/shared/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/shared/ui/shadcn/card";

import { ApplicationResponse } from "../../model/application-schemas";

interface CardApplicationProps {
  application: ApplicationResponse;
}

export const CardApplication = ({ application }: CardApplicationProps) => {
  return (
    <Card className="w-full max-w-5xl mx-auto p-6 my-4 gap-2">
      <CardHeader className="grid grid-cols-2 min-[470px]:grid-cols-[auto_auto_auto_1fr]  items-stretch p-0 m-0">
        <p className="min-[500px]:text-nowrap  flex items-center justify-end ">
          <span className="hidden sm:block mr-0.5">Статус:</span>
          <span
            className={
              application.status === "open"
                ? "text-green-600/60 font-semibold"
                : "text-red-600/60 font-semibold"
            }
          >
            {application.status === "open" ? "В РАБОТЕ" : "ЗАВЕРШЕНА"}
          </span>
        </p>
        <Badge variant="outline" className="h-6 ">
          {application.operation_type.name}
        </Badge>
        <Badge
          variant={application.status === "open" ? "success" : "destructive"}
          className="h-6 max-[500px]:order-first"
        >
          {application.amount} | {application.currency.code}
        </Badge>
        <CardDescription className="p-0 m-0 flex justify-end items-center">
          <Badge variant="secondary">{new Date(application.createdAt).toLocaleString()}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className=" flex p-0 m-0">
        <div className="grid grid-cols-2 md:grid-cols-4 md:gap-6 w-full">
          <p className="flex flex-col">
            <span>Исполнитель:</span> <span>{application.assignee_user.username}</span>{" "}
          </p>
          <p className="flex flex-col md:text-nowrap max-[500px]:text-right">
            <span>Дата встречи: </span>{" "}
            <span>{new Date(application.meetingDate).toLocaleString()}</span>{" "}
          </p>
          <p className="flex flex-col">
            {" "}
            <span>Telegram :</span>{" "}
            <span
              className="cursor-pointer select-none"
              role="button"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                copyHandler(application.telegramUsername);
              }}
            >
              {application.telegramUsername || "—"}
            </span>{" "}
          </p>
          <div className="flex flex-col max-[500px]:text-right">
            <p>Телефон:</p>
            <p
              role="button"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                copyHandler(application.phone);
              }}
            >
              {application.phone || "—"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 min-[500px]:flex-row justify-between  p-0 m-0">
        <p className="self-stretch">{application.description}</p>
        <div className="flex justify-between gap-2.5 self-stretch">
          <Button
            className="cursor-pointer select-none"
            size="icon"
            role="button"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              copyHandler(application.description);
            }}
          >
            <Copy />
          </Button>
          <Button
            className="cursor-pointer select-none"
            role="button"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              copyHandler(application.id.toString());
            }}
          >
            {application.id}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
