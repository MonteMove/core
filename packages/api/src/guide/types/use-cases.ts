import { GuideResponseDto } from '../dto';

export interface CreateGuideOutput {
  message: string;
  guide: GuideResponseDto;
}

export interface GetGuideByIdOutput {
  guide: GuideResponseDto;
}

export interface GetGuidesOutput {
  guides: GuideResponseDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateGuideOutput {
  message: string;
  guide: GuideResponseDto;
}

export interface DeleteGuideOutput {
  message: string;
}
