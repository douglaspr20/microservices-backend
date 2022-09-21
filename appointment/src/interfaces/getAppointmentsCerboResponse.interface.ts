import { IAppointmentCerbo } from './appointmentCerbo.interface';

export interface IGetAppointmentResponseCerbo {
  object: string;
  total_count: number;
  has_more: boolean;
  data: IAppointmentCerbo[];
}
