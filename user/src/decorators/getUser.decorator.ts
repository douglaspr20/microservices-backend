import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const { user } = req;

  if (!user) {
    throw new InternalServerErrorException('User not found (request)');
  }
  let response = {};

  if (data && typeof data === 'string') {
    response = user[data];
  } else if (data && data.length > 0) {
    for (const prop of data) {
      if (user[prop]) {
        response[prop] = user[prop];
      }
    }
  } else {
    response = user;
  }

  return response;
});
