"use client";

import { useCallback } from "react";

import { useRouter, useSearchParams } from "next/navigation";

export function useAnalyticsFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const month = searchParams.get("month") || "";

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${window.location.pathname}?${params.toString()}`);
    },
    [searchParams, router]
  );

  return {
    month,
    setFilter,
  };
}
