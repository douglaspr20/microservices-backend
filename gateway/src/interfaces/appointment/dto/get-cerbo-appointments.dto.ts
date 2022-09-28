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
  start_date: string;

  @IsDateString()
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
