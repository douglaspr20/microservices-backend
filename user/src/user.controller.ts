import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './services/user.service';

import {
  CreateUserDto,
  IUserSearchResponse,
  IUserCreateResponse,
  LoginUserDto,
  GetUserByIdDto,
  UpdateUserDto,
} from './interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user_register')
  async register(
    @Payload() createUserDto: CreateUserDto,
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
      createUserDto.Email,
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
      delete createdUser.Password;
      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        user: createdUser,
        errors: null,
      };
    } catch (e) {
      console.log(e);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        user: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('user_login')
  async login(@Payload() userInfo: LoginUserDto): Promise<IUserSearchResponse> {
    if (!userInfo.Email || !userInfo.Password) {
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

  @MessagePattern('search_user_by_id')
  async searchUserById(
    @Payload() getUserByIdDto: GetUserByIdDto,
  ): Promise<IUserSearchResponse> {
    if (!getUserByIdDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad request, data missing',
        user: null,
      };
    }

    try {
      const user = await this.userService.searchUserById(getUserByIdDto.userId);

      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
          user: null,
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'User login successfully',
        user: user,
      };
    } catch (e) {
      console.log(e);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        user: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('update_user')
  async updateUser(
    @Payload() updateUserDto: UpdateUserDto,
  ): Promise<IUserSearchResponse> {
    if (!updateUserDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad request, data missing',
        user: null,
      };
    }

    const { id } = updateUserDto;

    const user = await this.userService.updateUser(id, updateUserDto);

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
        user: null,
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'User updated successfully',
      user: user,
    };
  }
}
