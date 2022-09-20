import { IPatient } from './patient.interface';

export class IGetSinglePatientResponse {
  status: number;
  message: string;
  data: IPatient;
  errors: { [key: string]: any };
}
