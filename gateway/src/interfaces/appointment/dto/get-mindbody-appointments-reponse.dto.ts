import { PaginationResponse } from 'src/interfaces/common';
import { IAppointmentMindBody } from '../appointmentMindBody.interface';

export class GetMindBodyAppointmentsResponseDto {
  message: string;
  data?: {
    wellnessAppointments: IAppointmentMindBody[];
    paginationResponse: PaginationResponse;
  } | null;
}
