import { IPatientVaccine } from './patientVaccine.interface';

export interface IGetVaccinesPatient {
  object: string;
  total_count: number;
  has_more: boolean;
  data: IPatientVaccine[];
}
