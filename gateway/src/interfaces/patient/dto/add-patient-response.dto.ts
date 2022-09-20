import { IPatient } from '../patient.interface';

export class AddPatientResponseDto {
  message: string;
  data: IPatient;
  errors: { [key: string]: any };
}
