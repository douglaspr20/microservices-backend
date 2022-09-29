import { IsString } from 'class-validator';

export class ConfirmCreateUserDto {
  @IsString()
  email: string;

  @IsString()
  verificationCode: string;
}
