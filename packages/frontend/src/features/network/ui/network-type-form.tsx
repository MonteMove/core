'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useNetworksList } from '@/entities/network/model/use-networks-list';
import {
  CreateNetworkTypeRequest,
  CreateNetworkTypeSchema,
  NetworkType,
  UpdateNetworkTypeRequest,
  UpdateNetworkTypeSchema,
} from '@/entities/network/model/network-type-schemas';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';

import { useCreateNetworkType } from '../hooks/use-create-network-type';
import { useUpdateNetworkType } from '../hooks/use-update-network-type';

interface NetworkTypeFormProps {
  isEdit?: boolean;
  initialData?: NetworkType;
}

export function NetworkTypeForm({
  isEdit = false,
  initialData,
}: NetworkTypeFormProps) {
  const router = useRouter();
  const createMutation = useCreateNetworkType();
  const updateMutation = useUpdateNetworkType();
  const { data: networksData, isLoading: networksLoading } = useNetworksList();

  const form = useForm<CreateNetworkTypeRequest | UpdateNetworkTypeRequest>({
    resolver: zodResolver(
      isEdit ? UpdateNetworkTypeSchema : CreateNetworkTypeSchema,
    ),
    defaultValues:
      isEdit && initialData
        ? {
            networkId: initialData.networkId,
            code: initialData.code,
            name: initialData.name,
          }
        : {
            networkId: '',
            code: '',
            name: '',
          },
  });

  const onSubmit = async (
    data: CreateNetworkTypeRequest | UpdateNetworkTypeRequest,
  ) => {
    if (isEdit && initialData) {
      await updateMutation.mutateAsync({
        id: initialData.id,
        data: data as UpdateNetworkTypeRequest,
      });
    } else {
      await createMutation.mutateAsync(data as CreateNetworkTypeRequest);
    }
    router.push(ROUTER_MAP.NETWORK_TYPES);
  };

  const mutation = isEdit ? updateMutation : createMutation;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="networkId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Сеть <span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите сеть" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {networksLoading && (
                    <SelectItem value="loading" disabled>
                      Загрузка...
                    </SelectItem>
                  )}
                  {networksData?.networks.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.code} — {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Код типа <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="ERC-20" {...field} />
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
                <Input placeholder="ERC-20 Token Standard" {...field} />
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
            onClick={() => router.push(ROUTER_MAP.NETWORK_TYPES)}
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
                : 'Создать тип сети'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
