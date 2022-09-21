import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { validStatus } from './get-cerbo-appointments.dto';

export class AddCerboAppointmentDto {
  @IsDateString()
  start_date_time: string;

  @IsDateString()
  end_date_time: string;

  @IsNumber({}, { each: true })
  provider_ids: number;

  @IsNumber()
  pt_id: number;

  @IsNumber()
  appointment_type: number;

  @IsString()
  title: string;

  @IsString()
  appointment_note: string;

  @IsString()
  @IsEnum(validStatus)
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  telemedicine?: boolean;
}
