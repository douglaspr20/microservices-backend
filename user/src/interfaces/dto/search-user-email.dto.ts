import { IsEmail, IsString } from 'class-validator';

export class SearchUserEmailDto {
  @IsString()
  @IsEmail()
  email: string;
}
