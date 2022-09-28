import { IAppointmentMindBody } from '../appointmentMindBody.interface';

export class GetSingleMindBodyAppointmentResponseDto {
  status: number;
  message: string;
  data: IAppointmentMindBody | null;
}
