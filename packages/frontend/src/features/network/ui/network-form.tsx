'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  CreateNetworkRequest,
  CreateNetworkSchema,
  Network,
  UpdateNetworkRequest,
  UpdateNetworkSchema,
} from '@/entities/network/model/network-schemas';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcn/form';
import { Input } from '@/shared/ui/shadcn/input';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';

import { useCreateNetwork } from '../hooks/use-create-network';
import { useUpdateNetwork } from '../hooks/use-update-network';

interface NetworkFormProps {
  isEdit?: boolean;
  initialData?: Network;
}

export function NetworkForm({ isEdit = false, initialData }: NetworkFormProps) {
  const router = useRouter();
  const createMutation = useCreateNetwork();
  const updateMutation = useUpdateNetwork();

  const form = useForm<CreateNetworkRequest | UpdateNetworkRequest>({
    resolver: zodResolver(isEdit ? UpdateNetworkSchema : CreateNetworkSchema),
    defaultValues:
      isEdit && initialData
        ? {
            code: initialData.code,
            name: initialData.name,
          }
        : {
            code: '',
            name: '',
          },
  });

  const onSubmit = async (
    data: CreateNetworkRequest | UpdateNetworkRequest,
  ) => {
    if (isEdit && initialData) {
      await updateMutation.mutateAsync({
        id: initialData.id,
        data: data as UpdateNetworkRequest,
      });
    } else {
      await createMutation.mutateAsync(data as CreateNetworkRequest);
    }
    router.push(ROUTER_MAP.NETWORKS);
  };

  const mutation = isEdit ? updateMutation : createMutation;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Код сети <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="BTC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Название <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Bitcoin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4 md:flex-row md:justify-end">
          <Button
            type="button"
            variant="outline"
            className="md:w-fit"
            onClick={() => router.push(ROUTER_MAP.NETWORKS)}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            className="md:w-fit"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? isEdit
                ? 'Сохранение...'
                : 'Создание...'
              : isEdit
                ? 'Сохранить'
                : 'Создать сеть'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
