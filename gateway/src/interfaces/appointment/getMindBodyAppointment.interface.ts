import { PaginationResponse } from '../common';
import { IAppointmentMindBody } from './appointmentMindBody.interface';

export class IGetMindBodyAppointmentsResponse {
  status: number;
  message: string;
  data?: {
    Appointments: IAppointmentMindBody[];
    PaginationResponse: PaginationResponse;
  } | null;
}
