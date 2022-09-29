import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { IUserSearchResponse } from '../interfaces/user';
import { ConfigService } from '../services/config.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
    const { clientId, userPoolId, region } = configService.get('cognito');

    const authority = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authority}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: clientId,
      issuer: authority,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: any) {
    const getUserResponse: IUserSearchResponse = await firstValueFrom(
      this.userServiceClient.send('search_user_by_email', {
        email: payload.email,
      }),
    );

    if (!payload.email_verified) {
      throw new UnauthorizedException('You need verify your email for logging');
    }

    if (!payload.sub) return false;

    return { ...getUserResponse.user, sub: payload.sub };
  }
}
