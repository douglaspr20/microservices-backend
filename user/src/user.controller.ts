import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './services/user.service';

import {
  CreateUserDto,
  IUserSearchResponse,
  LoginUserDto,
  GetUserByIdDto,
  UpdateUserDto,
  ChangePasswordDto,
  ConfirmForgotPasswordDto,
  CreateUserResponseDto,
  ConfirmCreateUserResponseDto,
  LoginResponseDto,
  ChangePasswordResponseDto,
  ForgotPasswordResponseDto,
  LogoutResponseDto,
  SearchUserEmailDto,
  UpdateUserResponseDto,
  RefreshTokenDto,
  ConfirmCreateUserDto,
} from './interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('update_user')
  async updateUser(
    @Payload() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    if (!updateUserDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad or missing parameter',
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

    delete user.mindBodyClientId;
    delete user.mindBodyToken;
    delete user.cerboPatientId;

    return {
      status: HttpStatus.OK,
      message: 'User updated successfully',
      user: user,
    };
  }

  @MessagePattern('user_register')
  async register(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    if (!createUserDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad or missing parameter',
      };
    }

    const userAlreadyExist = await this.userService.searchUserByEmail(
      createUserDto.email,
    );

    if (userAlreadyExist) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'User already has an account registered',
      };
    }

    try {
      await this.userService.register(createUserDto);
      return {
        status: HttpStatus.CREATED,
        message:
          'Your account was successfully created. Please check your email to verify your new account before logging in',
      };
    } catch (e) {
      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
        };
      }
      console.log(e.message);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('user_confirm_register')
  async confirmRegister(
    @Payload() confirmCreateUserDto: ConfirmCreateUserDto,
  ): Promise<ConfirmCreateUserResponseDto> {
    if (!confirmCreateUserDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for for confirm register',
      };
    }

    try {
      await this.userService.confirmRegister(confirmCreateUserDto);

      return {
        status: HttpStatus.OK,
        message: 'Account successfully verified',
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('user_resend_code')
  async resendVerificationCode(
    @Payload() email: string,
  ): Promise<ConfirmCreateUserResponseDto> {
    if (!email) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for for confirm register',
      };
    }

    try {
      await this.userService.resendVerificationCode(email);

      return {
        status: HttpStatus.OK,
        message: 'A new verification code has been sent to your email address',
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('user_login')
  async login(@Payload() userInfo: LoginUserDto): Promise<LoginResponseDto> {
    if (!userInfo.email || !userInfo.password) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Bad or missing parameter',
      };
    }

    try {
      const { RefreshToken, AccessToken, IdToken, ExpiresIn, userDb } =
        await this.userService.login(userInfo);

      return {
        status: HttpStatus.OK,
        message: 'Login successfully',
        idToken: IdToken,
        accessToken: AccessToken,
        expiresIn: ExpiresIn,
        refreshToken: RefreshToken,
        userDb,
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('user_change_password')
  async changePassword(
    @Payload() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    if (
      !changePasswordDto.email ||
      !changePasswordDto.currentPassword ||
      !changePasswordDto.newPassword
    ) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad or missing parameter.',
      };
    }

    const user = await this.userService.searchUserByEmail(
      changePasswordDto.email,
    );

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Incorrect username or password.',
      };
    }

    try {
      await this.userService.changePassword(changePasswordDto);

      return {
        status: HttpStatus.OK,
        message: 'Password changed successfully',
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('user_forgot_password')
  async forgotPassword(
    @Payload() email: string,
  ): Promise<ForgotPasswordResponseDto> {
    if (!email) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad or missing parameter',
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
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('user_confirm_forgot_password')
  async confirnForgotPassword(
    @Payload() confirmForgotPasswordDto: ConfirmForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    if (
      !confirmForgotPasswordDto.email ||
      !confirmForgotPasswordDto.password ||
      !confirmForgotPasswordDto.verificationCode
    ) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
      };
    }

    try {
      await this.userService.confirmForgotPassword(confirmForgotPasswordDto);

      return {
        status: HttpStatus.OK,
        message: 'Password changed successfully',
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('user_refresh_token')
  async userRefreshToken(
    @Payload() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponseDto> {
    if (!refreshTokenDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
      };
    }

    const { refreshToken, sub } = refreshTokenDto;

    try {
      const { IdToken, AccessToken, ExpiresIn, RefreshToken } =
        await this.userService.refreshToken(refreshToken, sub);

      return {
        status: HttpStatus.OK,
        message: 'successful token refresh',
        idToken: IdToken,
        accessToken: AccessToken,
        expiresIn: ExpiresIn,
        refreshToken: RefreshToken,
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('logout')
  async logOut(@Payload() accessToken: string): Promise<LogoutResponseDto> {
    try {
      await this.userService.logOut(accessToken);

      return {
        status: HttpStatus.OK,
        message: 'User is logged out',
      };
    } catch (e) {
      console.log(e);

      if (e.statusCode && e.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.statusCode,
          message: e.message,
        };
      }
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
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
        message: 'User Found',
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

  @MessagePattern('search_user_by_email')
  async searchUserByEmail(
    @Payload() searchUserEmailDto: SearchUserEmailDto,
  ): Promise<IUserSearchResponse> {
    if (!searchUserEmailDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad request, data missing',
        user: null,
      };
    }

    try {
      const user = await this.userService.searchUserByEmail(
        searchUserEmailDto.email,
      );

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
}
