import { IAppointmentType } from './appointmentTypeCerbo,interface';

export interface IGetAppointmentTypeResponseCerbo {
  object: string;
  total_count: number;
  has_more: boolean;
  data: IAppointmentType[];
}
