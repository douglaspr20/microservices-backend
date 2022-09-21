import { IAppointmentCerbo } from '../appointmentCerbo.interface';

export class GetSingleCerboAppointmentResponseDto {
  message: string;
  data: IAppointmentCerbo | null;
  errors: { [key: string]: any };
}
