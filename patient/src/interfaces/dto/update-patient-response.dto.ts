import { IPatient } from '../patient.interface';

export class UpdatePatientResponseDto {
  status: number;
  message: string;
  data: IPatient;
  errors: { [key: string]: any };
}
