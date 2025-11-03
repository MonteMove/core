import { AuthUserResponseDto } from '../dto';
import { TokenPair } from './token.types';
import { AuthUserResponse } from './user.types';

export interface RegisterUserOutput {
  message: string;
  user: AuthUserResponseDto;
}

export interface LoginUserOutput {
  tokens: TokenPair;
  user: AuthUserResponse;
}

export interface LogoutUserOutput {
  message: string;
}
