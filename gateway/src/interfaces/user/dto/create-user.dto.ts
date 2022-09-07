import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  IsDateString,
  Min,
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
  @MinLength(2)
  State: string;

  @IsNumber()
  @Min(100000, {
    message: 'the WorkPhone must have a minimum length of 6 digits.',
  })
  WorkPhone: number;

  @IsDateString()
  Birthdate: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character:',
  })
  Password: string;
}
