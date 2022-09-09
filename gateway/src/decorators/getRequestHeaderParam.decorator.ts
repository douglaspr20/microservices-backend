import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getRequestHeaderParam = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (key) {
      return req.headers[key];
    }

    return req.headers;
  },
);
