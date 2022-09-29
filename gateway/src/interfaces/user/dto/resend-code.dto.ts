import { IsEmail, IsString } from 'class-validator';

export class ResendCodeDto {
  @IsString()
  @IsEmail()
  email: string;
}
