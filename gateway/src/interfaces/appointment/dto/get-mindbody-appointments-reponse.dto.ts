import { IAppointmentMindBody } from '../appointmentMindBody.interface';

export class GetMindBodyAppointmentsResponseDto {
  message?: string;
  wellnessAppointments: IAppointmentMindBody[];
}
