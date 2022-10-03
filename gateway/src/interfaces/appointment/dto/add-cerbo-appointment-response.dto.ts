import { IAppointCerboResponse } from '../appointmentCerboResponse.interface';

export class AddAppointmentCerboResponseDto {
  message: string;
  data: IAppointCerboResponse | null;
}
