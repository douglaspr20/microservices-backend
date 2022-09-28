import {
  IsString,
  IsEmail,
  MinLength,
  IsNumber,
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

  @IsString()
  @MinLength(6, {
    message: 'the mobile phone must have a minimum length of 6 digits.',
  })
  mobilePhone: number;

  @IsObject()
  @IsOptional()
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @IsString()
  @IsOptional()
  mindBodyToken: string;

  @IsNumber()
  @IsOptional()
  mindBodyClientId: number;
}
