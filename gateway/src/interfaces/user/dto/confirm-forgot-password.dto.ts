import { IsString } from 'class-validator';

export class ConfirmForgotPasswordDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  verificationCode: string;
}
