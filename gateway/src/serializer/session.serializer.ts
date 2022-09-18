import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportSerializer } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user);
  }
  async deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void,
  ): Promise<any> {
    const userDb = await firstValueFrom(
      this.userServiceClient.send('search_user_by_id', {
        userId: payload.id,
      }),
    );

    if (userDb.status !== HttpStatus.OK) {
      return done(null, null);
    }

    return done(null, userDb.user);
  }
}
