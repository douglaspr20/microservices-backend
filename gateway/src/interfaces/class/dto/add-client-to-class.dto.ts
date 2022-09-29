import { IsBoolean, IsNumber } from 'class-validator';

export class AddClientToClassDto {
  @IsNumber()
  classId: number;

  @IsBoolean()
  test: boolean;

  @IsBoolean()
  requirePayment: boolean;

  @IsBoolean()
  waitlist: boolean;

  @IsBoolean()
  sendEmail: boolean;

  @IsBoolean()
  crossRegionalBooking: boolean;
}
