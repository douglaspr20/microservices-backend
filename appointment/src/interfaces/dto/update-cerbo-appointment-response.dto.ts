import { IAppointmentCerbo } from '../appointmentCerbo.interface';

export class UpdateCerboAppointmentResponseDto {
  status: number;
  message: string;
  data: IAppointmentCerbo | null;
  errors: { [key: string]: any };
}
