import {
  Body,
  Controller,
  Inject,
  Post,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateUserDto,
  CreateUserResponseDto,
  IUserCreateResponse,
  IUser,
} from '../interfaces/user';
import { ICreateMindBodyToken } from '../interfaces/token';
import {
  IClientAddedResponse,
  IGetClientsResponse,
} from '../interfaces/client';
import { LocalAuthGuard } from '../guards';
import { GetUserRequest } from '../decorators';

@Controller()
export class UserController {
  constructor(
    @Inject('CLIENT_SERVICE') private readonly clientServiceClient: ClientProxy,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  // @UseGuards(LocalAuthGuard)
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
        MindBodyToken: minbodyToken,
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

    return {
      message: registerUserReponse.message,
      data: {
        user: registerUserReponse.user,
      },
      errors: null,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@GetUserRequest() user: IUser): Promise<CreateUserResponseDto> {
    const createMindBodyTokenResponse: ICreateMindBodyToken =
      await firstValueFrom(
        this.tokenServiceClient.send('create_mind_body_token', {}),
      );
    const { minbodyToken } = createMindBodyTokenResponse;

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

    Promise.resolve(
      firstValueFrom(
        this.userServiceClient.send('update_user', {
          id: user.id,
          MindBodyToken: minbodyToken,
        }),
      ),
    );

    return {
      message: 'Login successfully',
      data: {
        user,
      },
      errors: null,
    };
  }
}
