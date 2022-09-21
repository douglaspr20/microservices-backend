import { IsNumberString } from 'class-validator';

export class DeleteCerboAppointmentDto {
  @IsNumberString()
  appointment_id: number;
}
