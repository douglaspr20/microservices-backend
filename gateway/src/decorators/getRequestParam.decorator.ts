import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getRequestParam = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    console.log(req);

    return req;
  },
);
