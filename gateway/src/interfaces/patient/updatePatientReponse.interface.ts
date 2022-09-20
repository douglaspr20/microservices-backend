import { IPatient } from './patient.interface';

export class IUpdatePatientResponse {
  status: number;
  message: string;
  data: IPatient;
  errors: { [key: string]: any };
}
