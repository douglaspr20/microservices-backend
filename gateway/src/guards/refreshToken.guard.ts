import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy,
  ) {
    super({});
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    console.log(authorization);

    // const tokenInfo = await firstValueFrom(
    //   this.tokenServiceClient.send('validate_token', {
    //     token: authorization.replace('Bearer ', ''),
    //   }),
    // );

    // console.log(authorization);

    return true;
  }
}
