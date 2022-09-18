import { Inject, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { firstValueFrom } from 'rxjs';
import { IUser, IUserSearchResponse } from 'src/interfaces/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
    super({
      usernameField: 'Email',
      passwordField: 'Password',
    });
  }

  async validate(Email: string, Password: string): Promise<IUser> {
    const getUserResponse: IUserSearchResponse = await firstValueFrom(
      this.userServiceClient.send('user_login', { Email, Password }),
    );

    if (getUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getUserResponse.message,
          data: null,
          errors: null,
        },
        getUserResponse.status,
      );
    }

    return getUserResponse.user;
  }
}
