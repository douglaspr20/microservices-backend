import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetSingleAppointmentDto {
  @IsNumberString()
  appointmentId: number;

  @IsString()
  @IsOptional()
  mindBodyAuthorization?: string;
}
