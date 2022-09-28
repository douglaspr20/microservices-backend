import { IAppointmentMindBody } from './appointmentMindBody.interface';

export class ISingleMindBodyAppointmentResponse {
  status: number;
  message: string;
  data: IAppointmentMindBody | null;
}
