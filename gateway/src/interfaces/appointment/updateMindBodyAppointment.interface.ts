import { IAppointmentMindBody } from './appointmentMindBody.interface';

export class IUpdateMindBodyAppointmentResponse {
  status: number;
  message: string;
  data: IAppointmentMindBody | null;
}
