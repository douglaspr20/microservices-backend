import { IAppointmentMindBody } from './appointmentMindBody.interface';

export class IAppointmentAddedResponse {
  status: number;
  message: string;
  data: IAppointmentMindBody | null;
  errors: { [key: string]: any };
}
