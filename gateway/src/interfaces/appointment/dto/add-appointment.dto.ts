import { IsBoolean, IsDateString, IsNumber } from 'class-validator';

export class AddAppointmentDto {
  @IsBoolean()
  ApplyPayment: false;

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
