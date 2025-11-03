import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { UserPayload } from '../types';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request: Request & { user: UserPayload } = ctx
      .switchToHttp()
      .getRequest();

    return request.user.id;
  },
);
