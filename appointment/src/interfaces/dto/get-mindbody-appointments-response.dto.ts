import { PaginationResponse } from '../paginationResponse.interface';
import { IAppointmentMindBody } from '../appointmentMindBody.interface';

export class GetMindBodyAppointmentsResponseDto {
  status: number;
  message: string;
  data?: {
    Appointments: IAppointmentMindBody[];
    PaginationResponse: PaginationResponse;
  } | null;
}
