import { IAppointmentCerbo } from '../appointmentCerbo.interface';

export class UpdateCerboAppointmentResponseDto {
  message: string;
  data: IAppointmentCerbo | null;
  errors: { [key: string]: any };
}
