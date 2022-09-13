import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class AddAppointmentDto {
  @IsBoolean()
  ApplyPayment: false;

  @IsNumberString()
  ClientId: string;

  @IsNumber()
  LocationId: number;

  @IsNumber()
  SessionTypeId: number;

  @IsNumber()
  StaffId: number;

  @IsDateString()
  StartDateTime: string;

  @IsString()
  mindbodyauthorization: string;
}
