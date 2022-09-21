import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { validStatus } from '../appointmentCerbo.interface';

export class UpdateCerboAppointmentDto {
  @IsNumberString()
  appointment_id: number;

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

  @IsNumber()
  @IsOptional()
  appointment_type: number;

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
