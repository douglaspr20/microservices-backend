import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { validStatus } from '../appointmentCerbo.interface';

export class AddCerboAppointmentDto {
  @IsString()
  title: string;

  @IsString()
  @IsEnum(validStatus)
  @IsOptional()
  appointmentStatus: string;

  @IsNumber({}, { each: true })
  providers: number;

  @IsObject()
  @IsOptional()
  telemedicine?: {
    isTelemedicine: false;
    telemedicineUrl: string;
  };

  @IsDateString()
  startDateTime: string;

  @IsDateString()
  endDateTime: string;

  @IsString()
  appointmentType: string;

  @IsString()
  appointmentNote: string;
}
