"use client";

import { useState } from "react";

import dynamic from "next/dynamic";

import { ReportsSheet } from "@/features/reports";
import { useIsMobile } from "@/shared";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared";
import { DynamicBreadcrumb } from "@/widgets";
import { AppSidebar } from "@/widgets";

const PageTransition = dynamic(() => import("@/shared/ui/components/page-transition"), {
  ssr: false,
});

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isTablet } = useIsMobile();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            {isTablet && <SidebarTrigger />}
            <DynamicBreadcrumb />
            <div className="ml-auto" />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <PageTransition>{children}</PageTransition>
        </main>
      </SidebarInset>
      <ReportsSheet />
    </SidebarProvider>
  );
}
