import { SessionResponseDto } from '../dto';

export interface GetSessionsOutput {
  sessions: SessionResponseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DeactivateUserSessionsOutput {
  message: string;
  deactivatedCount: number;
}

export interface DeactivateMySessionByIdOutput {
  message: string;
}
