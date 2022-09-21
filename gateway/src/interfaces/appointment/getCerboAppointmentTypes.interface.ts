import { IAppointmentType } from './appointmentTypeCerbo.interface';

export class IGetCerboAppointmentsTypesResponse {
  status: number;
  message: string;
  data: {
    total_count: number;
    has_more: boolean;
    appointmentTypes: IAppointmentType[];
  } | null;

  errors: { [key: string]: any };
}
