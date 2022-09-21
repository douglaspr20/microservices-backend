import { IsNumberString } from 'class-validator';

export class GetSingleCerboAppointmentDto {
  @IsNumberString()
  appointment_id: number;
}
