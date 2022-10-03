import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { validStatus } from '../../types';

export class AddCerboAppointmentDto {
  @IsString()
  title: string;

  @IsString()
  @IsEnum(validStatus)
  @IsOptional()
  status?: string;

  @IsNumber({}, { each: true })
  provider_ids: number;

  @IsBoolean()
  @IsOptional()
  telemedicine?: {
    isTelemedicine: false;
    telemedicineUrl: string;
  };

  @IsDateString()
  start_date_time: string;

  @IsDateString()
  end_date_time: string;

  @IsString()
  appointment_type: string;

  @IsString()
  appointment_note: string;

  @IsNumber()
  pt_id: number;
}
