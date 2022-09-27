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
  ChangePasswordDto,
  ConfirmForgotPasswordDto,
} from './interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user_register')
  async register(@Payload() createUserDto: CreateUserDto): Promise<any> {
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
      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        user: createdUser,
        errors: null,
      };
    } catch (e) {
      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
          user: null,
          errors: e.errors,
        };
      }
      console.log(e.message);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        user: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('user_confirm_register')
  async confirmRegister(@Payload() createUserDto: CreateUserDto): Promise<any> {
    if (!createUserDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for register user',
        user: null,
        errors: null,
      };
    }

    try {
      const createdUser = await this.userService.confirmRegister(createUserDto);

      return {
        status: HttpStatus.CREATED,
        message: 'User register successfully',
        user: createdUser,
        errors: null,
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
          user: null,
          errors: e.errors,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        user: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('user_login')
  async login(@Payload() userInfo: LoginUserDto): Promise<any> {
    if (!userInfo.email || !userInfo.password) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'User not found',
        user: null,
      };
    }

    try {
      const userLoginInfo = await this.userService.login(userInfo);

      if (!userLoginInfo) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          message: 'User not found',
          userLoginInfo: null,
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'User login successfully',
        userLoginInfo,
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: 'Incorrect email or password.',
          userLoginInfo: null,
          errors: e.errors,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        userLoginInfo: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('user_change_password')
  async changePassword(
    @Payload() changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    if (
      !changePasswordDto.email ||
      !changePasswordDto.currentPassword ||
      !changePasswordDto.newPassword
    ) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for change password',
        user: null,
      };
    }

    try {
      const changePassword = await this.userService.changePassword(
        changePasswordDto,
      );

      if (!changePassword) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          message: 'something went wrong',
          user: null,
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'Password changed successfully',
        user: null,
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
          userLoginInfo: null,
          errors: e.errors,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        userLoginInfo: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('user_forgot_password')
  async forgotPassword(@Payload() email: string): Promise<any> {
    if (!email) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
        user: null,
      };
    }

    try {
      await this.userService.forgotPassword(email);

      return {
        status: HttpStatus.OK,
        message:
          'A code has been sent to your email address to recover your password.',
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
          userLoginInfo: null,
          errors: e.errors,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        userLoginInfo: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('user_confirm_forgot_password')
  async confirnForgotPassword(
    @Payload() confirmForgotPasswordDto: ConfirmForgotPasswordDto,
  ): Promise<any> {
    if (
      !confirmForgotPasswordDto.email ||
      !confirmForgotPasswordDto.password ||
      !confirmForgotPasswordDto.verificationCode
    ) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
        user: null,
      };
    }

    try {
      await this.userService.confirmForgotPassword(confirmForgotPasswordDto);

      return {
        status: HttpStatus.OK,
        message: 'Password changed successfully',
        user: null,
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
          userLoginInfo: null,
          errors: e.errors,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        userLoginInfo: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('user_refresh_token')
  async userRefreshToken(@Payload() refreshToken: string): Promise<any> {
    if (!refreshToken) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
        user: null,
      };
    }

    const token = await this.userService.refreshToken(refreshToken);

    if (!token) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Something went wrong',
        user: null,
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'token refresh successfully',
      user: null,
    };
  }

  @MessagePattern('logout')
  async logOut(@Payload() accessToken: string) {
    try {
      await this.userService.logOut(accessToken);

      return {
        status: HttpStatus.OK,
        message: 'Logout',
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
          userLoginInfo: null,
          errors: e.errors,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        userLoginInfo: null,
        errors: e.errors,
      };
    }
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
