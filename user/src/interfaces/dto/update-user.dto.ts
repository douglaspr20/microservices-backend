import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(2)
  @IsOptional()
  FirstName: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  LastName: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  Email: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  State: string;

  @IsNumber()
  @MinLength(8)
  @IsOptional()
  WorkPhone: number;

  @IsDate()
  @IsEmail()
  @IsOptional()
  Birthdate: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @IsOptional()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character:',
  })
  Password: string;

  @IsString()
  @IsOptional()
  MindBodyToken: string;

  @IsNumber()
  @IsOptional()
  MindBodyClientId: number;
}
