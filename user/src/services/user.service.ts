import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';
import {
  ChangePasswordDto,
  ConfirmForgotPasswordDto,
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from '../interfaces';
import { User } from '../entities/user.entity';
import { ConfigService } from './config.service';

@Injectable()
export class UserService {
  private aws = AWS;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const { region, accessKeyId, secretAccessKey } =
      this.configService.get('cognito');

    this.aws.config.update({
      region,
      accessKeyId,
      secretAccessKey,
    });
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const { clientSecret, clientId } = this.configService.get('cognito');

    const cognito = new this.aws.CognitoIdentityServiceProvider();

    const hash = crypto
      .createHmac('sha256', clientSecret)
      .update(email + clientId)
      .digest('base64');

    const userRegister = await cognito
      .signUp({
        ClientId: clientId,
        Username: email,
        Password: password,
        SecretHash: hash,
      })
      .promise();

    return {
      ...userRegister,
    };
  }

  async confirmRegister(createUserDto: CreateUserDto) {
    const { email, verificationCode } = createUserDto;

    const { clientId, clientSecret } = this.configService.get('cognito');

    const cognito = new this.aws.CognitoIdentityServiceProvider();

    const hash = crypto
      .createHmac('sha256', clientSecret)
      .update(email + clientId)
      .digest('base64');

    await cognito
      .confirmSignUp({
        ClientId: clientId,
        Username: email,
        ConfirmationCode: verificationCode,
        SecretHash: hash,
      })
      .promise();

    const newUser = this.userRepository.create(createUserDto);

    await this.userRepository.save(newUser);

    delete newUser.mindBodyToken;
    delete newUser.mindbodyClientId;
    delete newUser.cerboPatientId;

    return newUser;
  }

  async login(userInfo: LoginUserDto) {
    const { email, password } = userInfo;

    const { clientId, clientSecret, userPoolId } =
      this.configService.get('cognito');

    const cognito = new this.aws.CognitoIdentityServiceProvider();

    const hash = crypto
      .createHmac('sha256', clientSecret)
      .update(email + clientId)
      .digest('base64');

    const initAuthResponse = await cognito
      .adminInitiateAuth({
        UserPoolId: userPoolId,
        ClientId: clientId,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: hash,
        },
      })
      .promise();

    return initAuthResponse;
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, authorization } = changePasswordDto;
    const cognito = new this.aws.CognitoIdentityServiceProvider();

    return await cognito
      .changePassword({
        AccessToken: authorization.replace('Bearer ', ''),
        PreviousPassword: currentPassword,
        ProposedPassword: newPassword,
      })
      .promise();
  }

  async forgotPassword(email: string) {
    const cognito = new this.aws.CognitoIdentityServiceProvider();

    const { clientId, clientSecret } = this.configService.get('cognito');

    const hash = crypto
      .createHmac('sha256', clientSecret)
      .update(email + clientId)
      .digest('base64');

    return await cognito
      .forgotPassword({
        ClientId: clientId,
        Username: email,
        SecretHash: hash,
      })
      .promise();
  }

  async confirmForgotPassword(confirmPasswordDto: ConfirmForgotPasswordDto) {
    const { email, verificationCode, password } = confirmPasswordDto;

    const { clientId, clientSecret } = this.configService.get('cognito');

    const cognito = new this.aws.CognitoIdentityServiceProvider();

    const hash = crypto
      .createHmac('sha256', clientSecret)
      .update(email + clientId)
      .digest('base64');

    return await cognito
      .confirmForgotPassword({
        ClientId: clientId,
        Username: email,
        ConfirmationCode: verificationCode,
        Password: password,
        SecretHash: hash,
      })
      .promise();
  }

  async refreshToken(refreshToken: string) {
    const { clientId } = this.configService.get('cognito');

    const cognito = new this.aws.CognitoIdentityServiceProvider();

    return await cognito
      .initiateAuth({
        ClientId: clientId,
        AuthFlow: 'REFRESH_TOKEN ',
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      })
      .promise();
  }

  async logOut(accessToken: string) {
    const cognito = new this.aws.CognitoIdentityServiceProvider();

    return await cognito
      .globalSignOut({
        AccessToken: accessToken,
      })
      .promise();
  }

  async searchUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async searchUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userRepository.findOneBy({ id });

    if (!userToUpdate) {
      return null;
    }

    const result = await this.userRepository.update(
      { id },
      {
        ...updateUserDto,
      },
    );

    return result.raw;
  }
}
