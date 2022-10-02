import { IPatientBloodPressure } from './patientBloodPressure.interface';
import { IPatientHeightOrWeight } from './patientHeightWeight.interface';

export interface IGetVitalsPatient {
  object: string;
  total_count: number;
  has_more: boolean;
  data: IPatientHeightOrWeight[] | IPatientBloodPressure[];
}
