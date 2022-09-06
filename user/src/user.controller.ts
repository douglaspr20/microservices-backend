import { Controller, Body, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './services/user.service';

import {
  CreateUserDto,
  IUserSearchResponse,
  IUserCreateResponse,
  LoginUserDto,
} from './interfaces/user';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user_register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserCreateResponse> {
    if (!createUserDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for register user',
        user: null,
        errors: null,
      };
    }

    const userAlreadyExist = await this.userService.searchUserByEmail(
      createUserDto.email,
    );

    if (userAlreadyExist) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Conflict',
        user: null,
        errors: {
          email: {
            message: 'User already exists',
          },
        },
      };
    }

    try {
      const createdUser = await this.userService.register(createUserDto);
      delete createdUser.password;
      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        user: createdUser,
        errors: null,
      };
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        user: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('user_login')
  async login(@Body() userInfo: LoginUserDto): Promise<IUserSearchResponse> {
    if (!userInfo.email || !userInfo.password) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'User not found',
        user: null,
      };
    }

    const user = await this.userService.login(userInfo);

    if (!user) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'User not found',
        user: null,
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'User login successfully',
      user: user,
    };
  }
}
