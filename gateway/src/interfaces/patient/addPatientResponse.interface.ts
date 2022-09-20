import { IPatient } from './patient.interface';

export class IAddPatientResponse {
  status: number;
  message: string;
  data: IPatient;
  errors: { [key: string]: any };
}
