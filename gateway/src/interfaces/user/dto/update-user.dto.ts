import {
  IsString,
  IsEmail,
  MinLength,
  IsNumber,
  Min,
  IsOptional,
  IsObject,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  birthdate: string;

  @IsNumber()
  @IsOptional()
  @Min(100000, {
    message: 'the WorkPhone must have a minimum length of 6 digits.',
  })
  mobilePhone: number;

  @IsObject()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  mindBodyToken: string;

  @IsNumber()
  @IsOptional()
  mindBodyClientId: number;
}
