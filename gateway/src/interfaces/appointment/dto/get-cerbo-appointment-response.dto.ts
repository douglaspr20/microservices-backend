import { IAppointmentCerbo } from '../appointmentCerbo.interface';

export class GetCerboAppointmentsResponseDto {
  message: string;
  data: {
    total_count: number;
    has_more: boolean;
    appointments: IAppointmentCerbo[];
  } | null;

  errors: { [key: string]: any };
}
