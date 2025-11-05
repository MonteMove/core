import { UserResponseDto } from '../dto';

export interface GetUserByIdOutput {
    user: UserResponseDto;
}

export interface GetUsersOutput {
    users: UserResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UpdateUserOutput {
    message: string;
    user: UserResponseDto;
}

export interface DeleteUserOutput {
    message: string;
}

export interface UpdateUserRolesOutput {
    message: string;
    user: UserResponseDto;
}
