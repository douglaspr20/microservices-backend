import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenDto } from '../interfaces';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createToken(payload: CreateTokenDto): string {
    const token = this.jwtService.sign(payload);

    return token;
  }

  validateToken(token: string) {
    const tokenData = this.jwtService.verify(token) as {
      exp: number;
      userId: number;
    };
    const validateDate = Math.floor(new Date().getTime() / 1000);
    if (!tokenData || tokenData.exp <= validateDate) {
      return null;
    }
    return tokenData.userId;
  }
}
