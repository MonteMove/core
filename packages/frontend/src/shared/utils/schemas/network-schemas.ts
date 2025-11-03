import { z } from 'zod';

import { PaginationSchema } from './common-schemas';

export const NetworkSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
});

export const GetNetworksResponseSchema = z.object({
  networks: z.array(NetworkSchema),
  pagination: PaginationSchema,
});

export const NetworkTypeSummaryNetworkSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
});

export const NetworkTypeSchema = z.object({
  id: z.string().uuid(),
  networkId: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  network: NetworkTypeSummaryNetworkSchema.optional(),
});

export const GetNetworkTypesResponseSchema = z.object({
  networkTypes: z.array(NetworkTypeSchema),
  pagination: PaginationSchema,
});

export type Network = z.infer<typeof NetworkSchema>;
export type NetworksResponse = z.infer<typeof GetNetworksResponseSchema>;
export type NetworkType = z.infer<typeof NetworkTypeSchema>;
export type NetworkTypesResponse = z.infer<
  typeof GetNetworkTypesResponseSchema
>;
