"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { RegisterRequest } from "@/entities/auth";
import { UserService } from "@/entities/users/api/users-service";
import { ROUTER_MAP } from "@/shared/utils/constants/router-map";
import { USERS_QUERY_KEY } from "@/shared/utils/constants/users-query-key";

export const useCreateUser = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: USERS_QUERY_KEY,
    mutationFn: (userData: RegisterRequest) => UserService.createUser(userData),

    onSuccess: (data) => {
      toast.success(`Пользователь "${data.username}" создан успешно`);
    },

    onError: () => {
      router.push(ROUTER_MAP.ERROR);
      toast.error("Не удалось создать пользователя");
    },
  });
};
