import { IAppointment } from '../appointment.interface';

export class AddAppointmentResponseDto {
  status: number;
  message: string;
  data: IAppointment | null;

  errors: { [key: string]: any };
}
