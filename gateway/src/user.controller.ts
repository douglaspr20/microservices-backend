import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AppService } from './services/app.service';
import {
  CreateUserDto,
  CreateUserResponseDto,
  IUserSearchResponse,
  IUserCreateResponse,
  LoginUserDto,
} from './interfaces/user';
import { ICreateTokenResponse } from './interfaces/token';

@Controller()
export class UserController {
  constructor(
    private readonly appService: AppService,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/auth/register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const registerUserReponse: IUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('user_register', createUserDto),
    );

    if (registerUserReponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: registerUserReponse.message,
          data: null,
          errors: registerUserReponse.errors,
        },
        registerUserReponse.status,
      );
    }

    const createTokenResponse: ICreateTokenResponse = await firstValueFrom(
      this.tokenServiceClient.send('create_token', {
        userId: registerUserReponse.user.id,
      }),
    );

    return {
      message: registerUserReponse.message,
      data: {
        user: registerUserReponse.user,
        authorization: createTokenResponse.minbodyToken,
        selfAuthorization: createTokenResponse.token,
      },
      errors: null,
    };
  }

  @Post('/auth/login')
  async login(@Body() userInfo: LoginUserDto): Promise<CreateUserResponseDto> {
    const getUserResponse: IUserSearchResponse = await firstValueFrom(
      this.userServiceClient.send('user_login', userInfo),
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

    const createTokenResponse: ICreateTokenResponse = await firstValueFrom(
      this.tokenServiceClient.send('create_token', {
        userId: getUserResponse.user.id,
      }),
    );

    return {
      message: getUserResponse.message,
      data: {
        user: getUserResponse.user,
        authorization: createTokenResponse.minbodyToken,
        selfAuthorization: createTokenResponse.token,
      },
      errors: null,
    };
  }
}
