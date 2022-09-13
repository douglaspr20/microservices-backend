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
import { ICreateMindBodyToken, ICreateTokenResponse } from './interfaces/token';
import { IClientAddedResponse, IGetClientsResponse } from './interfaces/client';

@Controller()
export class UserController {
  constructor(
    private readonly appService: AppService,
    @Inject('CLIENT_SERVICE') private readonly clientServiceClient: ClientProxy,
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
    const createMindBodyTokenResponse: ICreateMindBodyToken =
      await firstValueFrom(
        this.tokenServiceClient.send('create_mind_body_token', {}),
      );

    if (createMindBodyTokenResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createMindBodyTokenResponse.message,
          data: null,
          errors: createMindBodyTokenResponse.errors,
        },
        createMindBodyTokenResponse.status,
      );
    }

    const { minbodyToken } = createMindBodyTokenResponse;

    const searchExistClientMinBodyReponse: IGetClientsResponse =
      await firstValueFrom(
        this.clientServiceClient.send('get_clients', {
          searchText: createUserDto.Email,
          mindbodyauthorization: minbodyToken,
        }),
      );

    let minbodyClientId: number;

    if (
      searchExistClientMinBodyReponse.status === HttpStatus.OK &&
      searchExistClientMinBodyReponse.data.Clients.length > 0
    ) {
      minbodyClientId = searchExistClientMinBodyReponse.data.Clients[0].Id;
    } else {
      const createdClientResponse: IClientAddedResponse = await firstValueFrom(
        this.clientServiceClient.send('add_client', {
          ...createUserDto,
          mindbodyauthorization: minbodyToken,
        }),
      );

      if (createdClientResponse.status !== HttpStatus.CREATED) {
        throw new HttpException(
          {
            message: createdClientResponse.message,
            data: null,
            errors: createdClientResponse.errors,
          },
          createdClientResponse.status,
        );
      }

      minbodyClientId = createdClientResponse.data.Id;
    }

    const registerUserReponse: IUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('user_register', {
        ...createUserDto,
        MindBodyClientId: minbodyClientId,
      }),
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
        authorization: createTokenResponse.token,
        mindBodyAuthorization: minbodyToken,
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
        authorization: createTokenResponse.token,
        mindBodyAuthorization: createTokenResponse.minbodyToken,
      },
      errors: null,
    };
  }
}
