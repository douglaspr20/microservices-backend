import { IAppointmentMindBody } from '../appointmentMindBody.interface';

export class AddAppointmentResponseDto {
  message: string;
  data: IAppointmentMindBody | null;
  errors: { [key: string]: any };
}
