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
      this.userServiceClient.send('user_update', {
        ...updateUserDto,
        userId: user.id,
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
  async confirmRegister(
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
          searchText: createUserDto.email,
          mindbodyauthorization: mindBodyToken,
        }),
      ),

      firstValueFrom(
        this.patientServiceClient.send('search_patient', {
          email: createUserDto.email,
        }),
      ),
    ]);

    let mindbodyClientId: number;
    let cerboPatientId: string;

    const requests: any[] = [];

    if (
      searchExistClientMinBodyReponse.status === HttpStatus.OK &&
      searchExistClientMinBodyReponse.data.Clients.length > 0
    ) {
      mindbodyClientId = searchExistClientMinBodyReponse.data.Clients[0].Id;
    } else {
      requests.push(
        firstValueFrom(
          this.clientServiceClient.send('add_client', {
            Email: createUserDto.email,
            FirstName: createUserDto.firstName,
            LastName: createUserDto.lastName,
            State: createUserDto.address.state,
            WorkPhone: createUserDto.mobilePhone,
            Birthdate: createUserDto.birthdate,
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
            first_name: createUserDto.firstName,
            last_name: createUserDto.lastName,
            dob: createUserDto.birthdate,
            sex: createUserDto.gender.substring(0, 1),
            email1: createUserDto.email,
          }),
        ),
      );
    }

    const result: [IClientAddedResponse, IAddPatientResponse] | any[] =
      await Promise.all(requests);

    result.forEach((res) => {
      if (res?.data?.Id) {
        mindbodyClientId = res.data.Id;
      }

      if (res?.data?.id) {
        cerboPatientId = res.data.id;
      }
    });

    const userRegisterResponse: IUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('user_confirm_register', {
        ...createUserDto,
        mindbodyClientId,
        cerboPatientId,
        mindbodyauthorization: mindBodyToken,
      }),
    );

    if (userRegisterResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: userRegisterResponse.message,
        },
        userRegisterResponse.status,
      );
    }

    return {
      message: userRegisterResponse.message,
    };
  }

  @Post('auth')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
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
          data: null,
        },
        userLoginResponse.status,
      );
    }

    const { idToken, accessToken, expiresIn, refreshToken, userDb } =
      userLoginResponse;

    Promise.resolve(
      firstValueFrom(
        this.userServiceClient.send('update_user', {
          id: userDb.id,
          mindBodyToken: mindBodyToken,
        }),
      ),
    );

    return {
      message: 'Login successfully',
      idToken,
      accessToken,
      expiresIn,
      refreshToken,
      errors: null,
    };
  }

  @Put('auth/changePassword')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const changePasswordResponse: any = await firstValueFrom(
      this.userServiceClient.send('user_change_password', {
        ...changePasswordDto,
      }),
    );
    if (changePasswordResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: changePasswordResponse.message,
          data: null,
          errors: changePasswordResponse.errors,
        },
        changePasswordResponse.status,
      );
    }
    return {
      message: 'Password Changed Successfully',
      data: {
        ...changePasswordResponse,
      },
      errors: null,
    };
  }

  @Post('auth/forgotPassword')
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
      message: confirmForgotPasswordResponse.message,
    };
  }

  @Post('auth/logout')
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
  @UseGuards(AuthGuard('jwt'))
  async refreshToken(
    @Body() refreshUserTokenDto: RefreshUserTokenDto,
    @GetUserRequest() user: IUser,
  ): Promise<LoginResponseDto> {
    const refreshTokenReponse: ILoginResponse = await firstValueFrom(
      this.userServiceClient.send('user_refresh_token', {
        refreshToken: refreshUserTokenDto.refreshToken,
        email: user.email,
      }),
    );

    if (refreshTokenReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: refreshTokenReponse.message,
        },
        refreshTokenReponse.status,
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
