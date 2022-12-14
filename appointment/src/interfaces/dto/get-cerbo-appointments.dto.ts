import {
  IsDateString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { validStatus } from '../../types';

export class GetCerboAppointmentsDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsNumber()
  @IsOptional()
  provider_id?: number;

  @IsNumber()
  @IsOptional()
  pt_id?: number;

  @IsString()
  @IsOptional()
  include_deleted?: boolean;

  @IsString()
  @IsEnum(validStatus)
  @IsOptional()
  status?: string;
}
