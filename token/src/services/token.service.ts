import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jsonwebtoken from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { CreateTokenDto } from '../interfaces';

export interface ClaimVerifyResult {
  readonly userName: string;
  readonly clientId: string;
  readonly isValid: boolean;
  readonly error?: any;
}

interface TokenHeader {
  kid: string;
  alg: string;
}
interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}
interface PublicKeyMeta {
  instance: PublicKey;
  pem: string;
}

interface PublicKeys {
  keys: PublicKey[];
}

interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}

interface Claim {
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username: string;
  client_id: string;
}

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  cacheKeys: MapOfKidToPublicKey | undefined;
  clientId = '4mm8teto8u73igon8bp5bsqsmu';
  userPoolId = 'us-east-1_zI9jAoquq';
  region = 'us-east-1';

  authority = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;

  async getPublicKeys(): Promise<MapOfKidToPublicKey> {
    if (!this.cacheKeys) {
      const url = `${this.authority}/.well-known/jwks.json`;

      const publicKeys = await axios.get<PublicKeys>(url);

      this.cacheKeys = publicKeys.data.keys.reduce((agg, current: any) => {
        const pem = jwkToPem(current);

        agg[current.kid] = { instance: current, pem };
        return agg;
      }, {} as MapOfKidToPublicKey);

      return this.cacheKeys;
    } else {
      return this.cacheKeys;
    }
  }

  createToken(payload: CreateTokenDto): string {
    const token = this.jwtService.sign(payload);

    return token;
  }

  async validateToken(token: string): Promise<any> {
    try {
      const tokenSections = (token || '').split('.');
      if (tokenSections.length < 2) {
        throw new Error('requested token is invalid');
      }

      const headerJSON = Buffer.from(tokenSections[0], 'base64').toString(
        'utf8',
      );

      const header = JSON.parse(headerJSON) as TokenHeader;

      const keys = await this.getPublicKeys();

      const key = keys[header.kid];
      if (key === undefined) {
        throw new Error('claim made for unknown kid');
      }

      const claim = jsonwebtoken.verify(token, key.pem, {
        algorithms: ['RS256'],
      }) as Claim;

      return claim;
    } catch (error) {
      return error;
    }
  }
}
