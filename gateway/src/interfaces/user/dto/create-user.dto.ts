import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  Min,
  IsObject,
  IsNotEmptyObject,
  IsDateString,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  gender: string;

  @IsDateString()
  birthdate: string;

  @IsNumber()
  @Min(100000, {
    message: 'the WorkPhone must have a minimum length of 6 digits.',
  })
  mobilePhone: number;

  @IsObject()
  @IsNotEmptyObject()
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character:',
  })
  password: string;

  @IsNumberString()
  @IsOptional()
  verificationCode?: string;
}
