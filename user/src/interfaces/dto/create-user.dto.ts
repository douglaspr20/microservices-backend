import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  FirstName: string;

  @IsString()
  @MinLength(2)
  LastName: string;

  @IsString()
  @IsEmail()
  Email: string;

  @IsString()
  @IsEmail()
  State: string;

  @IsNumber()
  @MinLength(8)
  WorkPhone: number;

  @IsDate()
  @IsEmail()
  Birthdate: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character:',
  })
  Password: string;

  @IsNumber()
  MindBodyClientId: number;
}
