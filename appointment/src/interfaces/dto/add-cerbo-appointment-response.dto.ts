import { IAppointmentCerbo } from '../appointmentCerbo.interface';

export class AddAppointmentCerboResponseDto {
  status: number;
  message: string;
  data: IAppointmentCerbo | null;
  errors: { [key: string]: any };
}
