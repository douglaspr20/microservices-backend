import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { validStatus } from '../appointmentCerbo.interface';

export class GetCerboAppointmentsDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;

  @IsDateString()
  @IsOptional()
  start_date: string;

  @IsDateString()
  @IsOptional()
  end_date: string;

  @IsNumberString()
  @IsOptional()
  provider_id?: number;

  @IsNumberString()
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
