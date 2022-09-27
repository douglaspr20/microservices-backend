import { Controller, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { TokenService } from './services/token.service';
import {
  CreateMindBodyTokenResponseDto,
  CreateTokenDto,
  CreateTokenResponseDto,
  DecodeTokenDto,
  DecodeTokenResponseDto,
  ICreateTokenMindBody,
} from './interfaces';
import { ConfigService } from './services/config.service';

@Controller('token')
export class TokenController {
  constructor(
    private readonly httpService: HttpService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  @MessagePattern('create_token')
  async createToken(
    @Payload() createTokenDto: CreateTokenDto,
  ): Promise<CreateTokenResponseDto> {
    try {
      const token: string = this.tokenService.createToken(createTokenDto);

      if (token) {
        const mindBodyTokenResponse = await this.createMindbodyToken();

        if (mindBodyTokenResponse.status !== HttpStatus.CREATED) {
          return {
            status: mindBodyTokenResponse.status,
            message: mindBodyTokenResponse.message,
            token: null,
            mindBodyToken: null,
            errors: mindBodyTokenResponse.errors,
          };
        }

        return {
          status: HttpStatus.CREATED,
          message: 'Token created successfully',
          token,
          mindBodyToken: mindBodyTokenResponse.mindBodyToken,
          errors: null,
        };
      }
    } catch (e) {
      const { response, message } = e as AxiosError;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          token: null,
          message: message,
          errors: e.errors,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        token: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('create_mind_body_token')
  async createMindbodyToken(): Promise<CreateMindBodyTokenResponseDto> {
    try {
      const { data } =
        await this.httpService.axiosRef.post<ICreateTokenMindBody>('/issue', {
          username: this.configService.get('mindbodyUser'),
          password: this.configService.get('mindbodyPassword'),
        });

      return {
        status: HttpStatus.CREATED,
        message: 'Token created successfully',
        mindBodyToken: data.AccessToken,
        errors: null,
      };
    } catch (e) {
      const { response, message } = e as AxiosError;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          mindBodyToken: null,
          message: message,
          errors: e.errors,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        mindBodyToken: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('validate_token')
  async decodeToken(@Payload() decodeTokenDto: DecodeTokenDto): Promise<any> {
    const tokenData = this.tokenService.validateToken(decodeTokenDto.token);

    // if (!tokenData) {
    //   return {
    //     status: HttpStatus.UNAUTHORIZED,
    //     message: 'Unauthorized',
    //     userId: null,
    //   };
    // }
    return {
      status: HttpStatus.OK,
      message: 'Token validate',
      tokenData,
    };
  }
}
