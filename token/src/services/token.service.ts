import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDto } from 'src/interfaces';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createToken(payload: CreateTokenDto): string {
    const token = this.jwtService.sign(payload);

    return token;
  }

  validateToken(token: string) {
    const tokenData = this.jwtService.decode(token) as {
      exp: number;
      userId: number;
    };

    if (!tokenData || tokenData.exp <= Math.floor(+new Date() / 1000)) {
      return null;
    }

    return tokenData.userId;
  }
}
