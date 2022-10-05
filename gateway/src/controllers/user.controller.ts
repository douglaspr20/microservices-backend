import {
  Body,
  Controller,
  Inject,
  Post,
  HttpStatus,
  HttpException,
  UseGuards,
  Get,
  Put,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';
import {
  CreateUserDto,
  CreateUserResponseDto,
  IUserCreateResponse,
  IUser,
  UpdateUserDto,
  ChangePasswordDto,
  LoginUserDto,
  ForgotPasswordDto,
  ConfirmForgotPasswordDto,
  IForgotPasswordResponse,
  ForgotPasswordResponseDto,
  LogoutResponseDto,
  ILogoutResponse,
  IUpdateUserResponse,
  RefreshUserTokenDto,
  ILoginResponse,
  LoginResponseDto,
  ResendCodeDto,
  ConfirmCreateUserDto,
  IUserSearchResponse,
} from '../interfaces/user';
import { ICreateMindBodyToken } from '../interfaces/token';

import { GetRequestHeaderParam, GetUserRequest } from '../decorators';
import {
  IClientAddedResponse,
  IClientUpdateResponse,
  IGetClientsResponse,
} from 'src/interfaces/client';
import {
  IAddPatientResponse,
  IGetPatientsResponse,
} from 'src/interfaces/patient';

@Controller('user')
export class UserController {
  constructor(
    @Inject('CLIENT_SERVICE') private readonly clientServiceClient: ClientProxy,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('PATIENT_SERVICE')
    private readonly patientServiceClient: ClientProxy,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUser(@GetUserRequest() user: IUser) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      birthdate: user.birthdate,
      mobilePhone: user.mobilePhone,
      address: user.address,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUserRequest() user: IUser,
  ): Promise<IUser> {
    const { mindBodyToken, mindBodyClientId, cerboPatientId } = user;

    const [updateClientResponse, updatePatientResponse]: [
      IClientUpdateResponse,
      IAddPatientResponse,
    ] = await Promise.all([
      firstValueFrom(
        this.clientServiceClient.send('update_client', {
          Email: updateUserDto.email,
          FirstName: updateUserDto.firstName,
          LastName: updateUserDto.lastName,
          State: updateUserDto.address.state,
          WorkPhone: updateUserDto.mobilePhone,
          Birthdate: updateUserDto.birthdate,
          mindBodyAuthorization: mindBodyToken,
          clientId: mindBodyClientId,
          CrossRegionalUpdate: false,
        }),
      ),
      firstValueFrom(
        this.patientServiceClient.send('update_patient', {
          first_name: updateUserDto.firstName,
          last_name: updateUserDto.lastName,
          dob: updateUserDto.birthdate,
          sex: updateUserDto.gender.substring(0, 1),
          email1: updateUserDto.email,
          patientId: cerboPatientId,
        }),
      ),
    ]);

    if (
      updateClientResponse.status !== HttpStatus.OK ||
      updatePatientResponse.status !== HttpStatus.OK
    ) {
      throw new HttpException(
        {
          message:
            updateClientResponse.status !== HttpStatus.OK
              ? updateClientResponse.message
              : updatePatientResponse.message,
        },
        updateClientResponse.status !== HttpStatus.OK
          ? updateClientResponse.status
          : updatePatientResponse.status,
      );
    }

    const updateUserReponse: IUpdateUserResponse = await firstValueFrom(
      this.userServiceClient.send('update_user', {
        ...updateUserDto,
        id: user.id,
      }),
    );

    if (updateUserReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateUserReponse.message,
          data: null,
        },
        updateUserReponse.status,
      );
    }

    return {
      ...updateUserReponse.user,
    };
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const registerUserReponse: IUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('user_register', {
        ...createUserDto,
      }),
    );

    if (registerUserReponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: registerUserReponse.message,
        },
        registerUserReponse.status,
      );
    }

    return {
      message: registerUserReponse.message,
    };
  }

  @Post('register/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmRegister(
    @Body() confirmCreateUserDto: ConfirmCreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const userConfirmResponse: IUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('user_confirm_register', {
        ...confirmCreateUserDto,
      }),
    );

    if (userConfirmResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: userConfirmResponse.message,
        },
        userConfirmResponse.status,
      );
    }

    const createMindBodyTokenResponse: ICreateMindBodyToken =
      await firstValueFrom(
        this.tokenServiceClient.send('create_mind_body_token', {}),
      );

    if (createMindBodyTokenResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createMindBodyTokenResponse.message,
        },
        createMindBodyTokenResponse.status,
      );
    }

    const { mindBodyToken } = createMindBodyTokenResponse;

    const [searchExistClientMinBodyReponse, searchExistPatientCerboReponse]: [
      IGetClientsResponse,
      IGetPatientsResponse,
    ] = await Promise.all([
      firstValueFrom(
        this.clientServiceClient.send('get_clients', {
          searchText: confirmCreateUserDto.email,
          mindbodyauthorization: mindBodyToken,
        }),
      ),

      firstValueFrom(
        this.patientServiceClient.send('search_patient', {
          email: confirmCreateUserDto.email,
        }),
      ),
    ]);

    let mindBodyClientId: number;
    let cerboPatientId: string;

    const requests: any[] = [];

    const userRegister: IUserSearchResponse = await firstValueFrom(
      this.userServiceClient.send('search_user_by_email', {
        email: confirmCreateUserDto.email,
      }),
    );

    const { user } = userRegister;

    if (
      searchExistClientMinBodyReponse.status === HttpStatus.OK &&
      searchExistClientMinBodyReponse.data.Clients.length > 0
    ) {
      mindBodyClientId = searchExistClientMinBodyReponse.data.Clients[0].Id;
    } else {
      requests.push(
        firstValueFrom(
          this.clientServiceClient.send('add_client', {
            Email: user.email,
            FirstName: user.firstName,
            LastName: user.lastName,
            State: user.address.state,
            WorkPhone: user.mobilePhone,
            Birthdate: user.birthdate,
            mindbodyauthorization: mindBodyToken,
          }),
        ),
      );
    }

    if (
      searchExistPatientCerboReponse.status === HttpStatus.OK &&
      searchExistPatientCerboReponse.data.patients.length > 0
    ) {
      cerboPatientId = searchExistPatientCerboReponse.data.patients[0].id;
    } else {
      requests.push(
        firstValueFrom(
          this.patientServiceClient.send('add_patient', {
            first_name: user.firstName,
            last_name: user.lastName,
            dob: user.birthdate,
            sex: user.gender.substring(0, 1),
            email1: user.email,
          }),
        ),
      );
    }

    const result: [IClientAddedResponse, IAddPatientResponse] | any[] =
      await Promise.all(requests);

    result.forEach((res) => {
      if (res?.data?.Id) {
        mindBodyClientId = res.data.Id;
      }

      if (res?.data?.id) {
        cerboPatientId = res.data.id;
      }
    });

    Promise.resolve(
      firstValueFrom(
        this.userServiceClient.send('update_user', {
          ...user,
          mindBodyClientId,
          cerboPatientId,
          mindBodyToken,
        }),
      ),
    );

    return {
      message: 'Your registration has been successfully confirmed',
    };
  }

  @Post('resendCode')
  @HttpCode(HttpStatus.OK)
  async resendVerificationCode(
    @Body() resendCodeDto: ResendCodeDto,
  ): Promise<CreateUserResponseDto> {
    const resendCodeResponse: IUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('user_resend_code', resendCodeDto.email),
    );

    if (resendCodeResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: resendCodeResponse.message,
        },
        resendCodeResponse.status,
      );
    }

    return {
      message: resendCodeResponse.message,
    };
  }

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const createMindBodyTokenResponse: ICreateMindBodyToken =
      await firstValueFrom(
        this.tokenServiceClient.send('create_mind_body_token', {}),
      );
    const { mindBodyToken } = createMindBodyTokenResponse;

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

    const userLoginResponse: ILoginResponse = await firstValueFrom(
      this.userServiceClient.send('user_login', {
        ...loginUserDto,
      }),
    );

    if (userLoginResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: userLoginResponse.message,
        },
        userLoginResponse.message === 'Incorrect username or password.'
          ? 401
          : userLoginResponse.status,
      );
    }

    const { idToken, accessToken, expiresIn, refreshToken, userDb } =
      userLoginResponse;

    Promise.resolve(
      firstValueFrom(
        this.userServiceClient.send('update_user', {
          id: userDb.id,
          mindBodyToken: mindBodyToken,
          refreshToken,
        }),
      ),
    );

    return {
      message: 'Login successfully',
      idToken,
      accessToken,
      expiresIn,
      refreshToken,
    };
  }

  @Put('auth/changePassword')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetRequestHeaderParam('accesstoken') authorization: string,
  ) {
    const changePasswordResponse: any = await firstValueFrom(
      this.userServiceClient.send('user_change_password', {
        ...changePasswordDto,
        authorization,
      }),
    );
    if (changePasswordResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: changePasswordResponse.message,
        },
        changePasswordResponse.message === 'Access Token has expired'
          ? 401
          : changePasswordResponse.status,
      );
    }
    return {
      message: 'Password was successfully updated',
    };
  }

  @Post('auth/forgotPassword')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPasswordSendCode(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    const forgotPasswordResponse: IForgotPasswordResponse =
      await firstValueFrom(
        this.userServiceClient.send(
          'user_forgot_password',
          forgotPasswordDto.email,
        ),
      );

    if (forgotPasswordResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: forgotPasswordResponse.message,
        },
        forgotPasswordResponse.status,
      );
    }

    return {
      message: forgotPasswordResponse.message,
    };
  }

  @Put('auth/forgotPassword')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPasswordRecovery(
    @Body() confirmForgotPasswordDto: ConfirmForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    const confirmForgotPasswordResponse: IForgotPasswordResponse =
      await firstValueFrom(
        this.userServiceClient.send(
          'user_confirm_forgot_password',
          confirmForgotPasswordDto,
        ),
      );

    if (confirmForgotPasswordResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: confirmForgotPasswordResponse.message,
        },
        confirmForgotPasswordResponse.status,
      );
    }

    return {
      message: 'Password was successfully updated',
    };
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  async logoutUser(
    @GetRequestHeaderParam('accesstoken') accesstoken: string,
  ): Promise<LogoutResponseDto> {
    const logoutResponse: ILogoutResponse = await firstValueFrom(
      this.userServiceClient.send('logout', accesstoken),
    );

    if (logoutResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: logoutResponse.message,
        },
        logoutResponse.status,
      );
    }

    return {
      message: logoutResponse.message,
    };
  }

  @Post('auth/refreshToken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshUserTokenDto: RefreshUserTokenDto,
    @GetRequestHeaderParam('authorization') authorization: string,
  ): Promise<LoginResponseDto | any> {
    if (!refreshUserTokenDto) {
      throw new UnauthorizedException();
    }

    if (!authorization) {
      throw new UnauthorizedException('Invalid refresh Token');
    }

    const { userInfo } = await firstValueFrom(
      this.tokenServiceClient.send('decode_token', {
        token: authorization.replace('Bearer ', ''),
      }),
    );

    if (!userInfo || !userInfo.sub || !userInfo.email_verified) {
      throw new UnauthorizedException('Invalid refresh Token');
    }

    const refreshTokenReponse: ILoginResponse = await firstValueFrom(
      this.userServiceClient.send('user_refresh_token', {
        refreshToken: refreshUserTokenDto.refreshToken,
        sub: userInfo.sub,
      }),
    );

    if (refreshTokenReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: refreshTokenReponse.message,
        },
        refreshTokenReponse.message === 'Invalid Refresh Token'
          ? 401
          : refreshTokenReponse.status,
      );
    }

    return {
      message: refreshTokenReponse.message,
      idToken: refreshTokenReponse.idToken,
      accessToken: refreshTokenReponse.accessToken,
      expiresIn: refreshTokenReponse.expiresIn,
      refreshToken: refreshTokenReponse.refreshToken,
    };
  }
}
