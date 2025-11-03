import { NetworkResponseDto } from '../dto';

export type NetworkResponse = NetworkResponseDto;

export interface CreateNetworkResponse {
  message: string;
  network: NetworkResponse;
}

export interface GetNetworkByIdResponse {
  network: NetworkResponse;
}

export interface GetNetworksResponse {
  networks: NetworkResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateNetworkResponse {
  message: string;
  network: NetworkResponse;
}

export interface DeleteNetworkResponse {
  message: string;
}

export interface RestoreNetworkOutput {
  message: string;
}
