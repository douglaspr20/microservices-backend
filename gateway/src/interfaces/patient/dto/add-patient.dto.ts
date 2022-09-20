import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Sex } from '../patient.interface';

export class AddPatientDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsDateString()
  dob: string;

  @IsString()
  @MaxLength(1)
  sex: Sex;

  @IsString()
  @IsOptional()
  email1?: string;

  @IsString()
  @IsOptional()
  email2?: string;

  @IsString()
  @IsOptional()
  skype_name?: string;

  @IsString()
  @IsOptional()
  phone_home?: string;

  @IsString()
  @IsOptional()
  phone_mobile?: string;

  @IsString()
  @IsOptional()
  phone_work?: string;

  @IsString()
  @IsOptional()
  phone_other?: string;

  @IsString()
  @IsOptional()
  primary_phone?: string;

  @IsNumberString()
  @IsOptional()
  fax_home?: string;

  @IsNumberString()
  @IsOptional()
  fax_work?: string;

  @IsString()
  @IsOptional()
  address1?: string;

  @IsString()
  @IsOptional()
  address2?: string;

  @IsNumberString()
  @IsOptional()
  zip?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;
}
