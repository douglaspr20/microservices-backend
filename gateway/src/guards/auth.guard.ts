import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IUserSearchResponse } from 'src/interfaces/user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization, mindbodyauthorization } = request.headers;

    const userTokenInfo = await firstValueFrom(
      this.tokenServiceClient.send('validate_token', {
        token: authorization.replace('Bearer ', ''),
      }),
    );

    if (!authorization || authorization === '' || !mindbodyauthorization) {
      return false;
    }

    if (!userTokenInfo || !userTokenInfo.userId) {
      return false;
    }

    const searchUserResponse: IUserSearchResponse = await firstValueFrom(
      this.userServiceClient.send('search_user_by_id', userTokenInfo.userId),
    );

    if (searchUserResponse.status !== HttpStatus.OK) {
      return false;
    }

    request.user = searchUserResponse.user;

    return true;
  }
}
