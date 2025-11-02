"use client";

import React from "react";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/shadcn/chart";
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

export type AnalyticsItemResponse = {
  month: string;
  incoming: number;
  outgoing: number;
  transactions: number;
};

const data = [
  { month: "Январь", incoming: 423, outgoing: 198, transactions: 134 },
  { month: "Февраль", incoming: 312, outgoing: 256, transactions: 101 },
  { month: "Апрель", incoming: 287, outgoing: 174, transactions: 92 },
  { month: "Май", incoming: 451, outgoing: 220, transactions: 145 },
  { month: "Июнь", incoming: 398, outgoing: 265, transactions: 120 },
  { month: "Октябрь", incoming: 512, outgoing: 198, transactions: 160 },
];

export const AnalyticsCharts = () => {
  const isLoading = false;

  if (!data || data.length === 0) {
    return <h2 className="text-2xl text-center">У вас нет аналитики</h2>;
  }

  const pieData = data.map((item) => ({
    name: item.month,
    value: item.incoming,
  }));

  const barChartConfig: ChartConfig = {
    incoming: { label: "Поступления", color: "var(--primary)" },
    outgoing: { label: "Расходы", color: "#0b3f61" },
  };

  const COLORS = ["#79bce9", "#4285F4", "#3367D6", "#1A73E8", "#174EA6", "#2C6BED"];

  return (
    <div className="flex flex-col md:flex-row gap-4 my-10">
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Доходы и Расходы</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Суммы по месяцам
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-60 w-full animate-pulse rounded-sm bg-gray-300" />
          ) : (
            <ChartContainer config={barChartConfig}>
              <BarChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="incoming" fill={barChartConfig.incoming.color} radius={4} />
                <Bar dataKey="outgoing" fill={barChartConfig.outgoing.color} radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="w-full md:w-1/2 flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-2xl font-semibold">Количество операций</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            За последние 6 месяцев
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {isLoading ? (
            <Skeleton className="h-60 w-full animate-pulse rounded-sm bg-gray-300" />
          ) : (
            <ChartContainer config={{ pie: { label: "Доходы" } }}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={pieData} dataKey="value" nameKey="name" label>
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
