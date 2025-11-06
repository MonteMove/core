import { z } from 'zod';

export const NetworkSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  updatedById: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  deleted: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateNetworkSchema = z.object({
  code: z.string().min(1, 'Код сети обязателен'),
  name: z.string().min(1, 'Название сети обязательно'),
});

export const UpdateNetworkSchema = z.object({
  code: z.string().min(1, 'Код сети обязателен').optional(),
  name: z.string().min(1, 'Название сети обязательно').optional(),
});

export const GetNetworksResponseSchema = z.object({
  networks: z.array(NetworkSchema),
});

export const GetNetworkResponseSchema = z.object({
  network: NetworkSchema,
});

export const CreateNetworkResponseSchema = z.object({
  message: z.string(),
  network: NetworkSchema,
});

export const UpdateNetworkResponseSchema = z.object({
  message: z.string(),
  network: NetworkSchema,
});

export const DeleteNetworkResponseSchema = z.object({
  message: z.string(),
});

export const RestoreNetworkResponseSchema = z.object({
  message: z.string(),
});

export type Network = z.infer<typeof NetworkSchema>;
export type CreateNetworkRequest = z.infer<typeof CreateNetworkSchema>;
export type UpdateNetworkRequest = z.infer<typeof UpdateNetworkSchema>;
export type GetNetworksResponse = z.infer<typeof GetNetworksResponseSchema>;
export type GetNetworkResponse = z.infer<typeof GetNetworkResponseSchema>;
export type CreateNetworkResponse = z.infer<typeof CreateNetworkResponseSchema>;
export type UpdateNetworkResponse = z.infer<typeof UpdateNetworkResponseSchema>;
export type DeleteNetworkResponse = z.infer<typeof DeleteNetworkResponseSchema>;
export type RestoreNetworkResponse = z.infer<
  typeof RestoreNetworkResponseSchema
>;
