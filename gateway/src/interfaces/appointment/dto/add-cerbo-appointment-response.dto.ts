import { IAppointmentCerbo } from '../appointmentCerbo.interface';

export class AddAppointmentCerboResponseDto {
  message: string;
  data: IAppointmentCerbo | null;
  errors: { [key: string]: any };
}
