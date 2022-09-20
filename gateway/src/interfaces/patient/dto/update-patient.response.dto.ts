import { IPatient } from '../patient.interface';

export class UpdatePatientResponseDto {
  message: string;
  data: IPatient;
  errors: { [key: string]: any };
}
