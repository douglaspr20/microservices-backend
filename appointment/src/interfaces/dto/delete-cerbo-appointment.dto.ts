import { IsNumberString } from 'class-validator';

export class DeleteCerboAppointmentDto {
  @IsNumberString()
  appointmentId: number;
}
