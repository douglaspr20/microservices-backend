import { IAppointmentCerbo } from './appointmentCerbo.interface';

export class IAddedCerboAppointment {
  status: number;
  message: string;
  data: IAppointmentCerbo | null;
  errors: { [key: string]: any };
}
