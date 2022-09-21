import { IAppointmentCerbo } from './appointmentCerbo.interface';

export class IUpdateCerboAppointmentResponse {
  status: number;
  message: string;
  data: IAppointmentCerbo | null;
  errors: { [key: string]: any };
}
