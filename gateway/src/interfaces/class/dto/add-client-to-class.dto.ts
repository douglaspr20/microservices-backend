import { IsBoolean, IsNumber, IsNumberString } from 'class-validator';

export class AddClientToClassDto {
  @IsNumberString()
  ClientId: string;

  @IsNumber()
  ClassId: number;

  @IsBoolean()
  Test: boolean;

  @IsBoolean()
  RequirePayment: boolean;

  @IsBoolean()
  Waitlist: boolean;

  @IsBoolean()
  SendEmail: boolean;

  @IsBoolean()
  CrossRegionalBooking: boolean;
}
