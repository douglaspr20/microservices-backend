import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsNumberString,
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

  @IsBoolean()
  StaffRequested: boolean;

  @IsDateString()
  StartDateTime: string;

  @IsBoolean()
  Test: boolean;
}
