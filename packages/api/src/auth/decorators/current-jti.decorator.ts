import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentJti = createParamDecorator((_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user: { jti: string } }>();

    return request.user?.jti;
});
