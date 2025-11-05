import { ApplicationResponseDto } from '../dto';

export interface CreateApplicationOutput {
    message: string;
    application: ApplicationResponseDto;
}

export interface GetApplicationByIdOutput {
    application: ApplicationResponseDto;
}

export interface GetApplicationsOutput {
    applications: ApplicationResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UpdateApplicationOutput {
    message: string;
    application: ApplicationResponseDto;
}

export interface DeleteApplicationOutput {
    message: string;
}
