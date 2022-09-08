import {
  IsString,
  IsEmail,
  MinLength,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsEmail()
  Email: string;

  @IsString()
  @MinLength(2)
  FirstName: string;

  @IsString()
  @MinLength(2)
  LastName: string;

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
  Test: string;
}
