import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  authorization: string;

  @IsString()
  email: string;

  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}
