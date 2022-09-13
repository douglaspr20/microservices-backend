import { IAppointment } from './appointment.interface';

export class IAppointmentAddedResponse {
  status: number;
  message: string;
  data: IAppointment | null;
  errors: { [key: string]: any };
}
