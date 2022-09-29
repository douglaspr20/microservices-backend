import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { validStatus } from '../appointmentCerbo.interface';

export class UpdateCerboAppointmentDto {
  @IsDateString()
  @IsOptional()
  start_date_time: string;

  @IsDateString()
  @IsOptional()
  end_date_time: string;

  @IsNumber({}, { each: true })
  @IsOptional()
  provider_ids: number;

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
