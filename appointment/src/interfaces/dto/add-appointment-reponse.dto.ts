import { IAppointmentMindBody } from '../appointmentMindBody.interface';

export class AddAppointmentResponseDto {
  status: number;
  message: string;
  data: IAppointmentMindBody | null;

  errors: { [key: string]: any };
}
