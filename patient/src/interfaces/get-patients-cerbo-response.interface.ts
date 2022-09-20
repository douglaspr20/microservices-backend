import { IPatient } from './patient.interface';

export interface IGetPatientsResponseCerbo {
  object: string;
  total_count: number;
  has_more: boolean;
  data: IPatient[];
}
