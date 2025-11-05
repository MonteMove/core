import { NetworkTypeResponseDto } from '../dto';

export type NetworkTypeResponse = NetworkTypeResponseDto;

export interface CreateNetworkTypeResponse {
    message: string;
    networkType: NetworkTypeResponse;
}

export interface GetNetworkTypeByIdResponse {
    networkType: NetworkTypeResponse;
}

export interface GetNetworkTypesResponse {
    networkTypes: NetworkTypeResponse[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UpdateNetworkTypeResponse {
    message: string;
    networkType: NetworkTypeResponse;
}

export interface DeleteNetworkTypeResponse {
    message: string;
}

export interface RestoreNetworkTypeOutput {
    message: string;
}
