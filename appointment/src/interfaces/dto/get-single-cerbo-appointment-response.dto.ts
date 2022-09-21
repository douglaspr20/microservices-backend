import { IAppointmentCerbo } from '../appointmentCerbo.interface';

export class GetSingleCerboAppointmentResponseDto {
  status: number;
  message: string;
  data: IAppointmentCerbo | null;

  errors: { [key: string]: any };
}
