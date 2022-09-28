import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { validStatus } from '../../types';

export class UpdateCerboAppointmentDto {
  @IsNumberString()
  appointmentId: number;

  @IsDateString()
  @IsOptional()
  start_date_time: string;

  @IsDateString()
  @IsOptional()
  end_date_time: string;

  @IsNumber({}, { each: true })
  @IsOptional()
  provider_ids: number;

  @IsNumber()
  @IsOptional()
  pt_id: number;

  @IsString()
  @IsOptional()
  appointment_type: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  appointment_note: string;

  @IsString()
  @IsEnum(validStatus)
  @IsOptional()
  status?: string;
}
