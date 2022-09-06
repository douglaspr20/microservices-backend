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
import { AppService } from './app.service';
import {
  CreateUserDto,
  CreateUserResponseDto,
  IServiceUserSearchResponse,
  IUserCreateResponse,
  LoginUserDto,
} from './interfaces/user';

@Controller()
export class UserController {
  constructor(
    private readonly appService: AppService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('register')
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

    return {
      message: registerUserReponse.message,
      data: {
        user: registerUserReponse.user,
        // token: registerUserReponse.token,
      },
      errors: null,
    };
  }

  @Post('login')
  async login(@Body() userInfo: LoginUserDto): Promise<CreateUserResponseDto> {
    const getUserResponse: IServiceUserSearchResponse = await firstValueFrom(
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

    // const createTokenResponse: IServiveTokenCreateResponse =
    //   await firstValueFrom(
    //     this.tokenServiceClient.send('token_create', {
    //       userId: getUserResponse.user.id,
    //     }),
    //   );

    return {
      message: getUserResponse.message,
      data: {
        user: getUserResponse.user,
        token: '',
      },
      errors: null,
    };
  }
}
