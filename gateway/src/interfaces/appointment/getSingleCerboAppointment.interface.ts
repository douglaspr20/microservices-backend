import { IAppointmentCerbo } from './appointmentCerbo.interface';

export class ISingleCerboAppointmentResponse {
  status: number;
  message: string;
  data: IAppointmentCerbo | null;
  errors: { [key: string]: any };
}
