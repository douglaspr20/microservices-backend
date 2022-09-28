import { IAppointmentMindBody } from '../appointmentMindBody.interface';

export class UpdateMindBodyAppointmentResponseDto {
  status: number;
  message: string;
  data: IAppointmentMindBody | null;
}
