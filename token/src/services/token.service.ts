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

  async validateToken(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // axios
      //   .get(tokenValidationUrl, {
      //     headers: { 'Content-Type': 'application/json' },
      //   })
      //   .then((response) => {
      //     const body = response.data;
      //     let pems = {};
      //     const keys = body['keys'];
      //     keys.forEach((key) => {
      //       const keyId = key.kid;
      //       const modulus = key.n;
      //       const exponent = key.e;
      //       const keyType = key.kty;
      //       const jwk = { kty: keyType, n: modulus, e: exponent };
      //       const pem = jwkToPem(jwk);
      //       pems[keyId] = pem;
      //     });
      //     const decodedJwt = jwt.decode(token, { complete: true });
      //     if (!decodedJwt) {
      //       reject(new Error('Not a valid JWT token'));
      //     }
      //     const kid = decodedJwt['header'].kid;
      //     const pem = pems[kid];
      //     if (!pem) {
      //       reject(new Error('Invalid token'));
      //     }
      //     jwt.verify(token, pem, (err, payload) => {
      //       if (err) {
      //         reject(new Error('Invalid token'));
      //       } else {
      //         resolve(pem);
      //       }
      //     });
      //   });
    });
  }
}
