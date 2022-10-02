import { IPatientRx } from './patientRx.interface';

export interface IGetRxes {
  object: string;
  total_count: number;
  has_more: boolean;
  data: IPatientRx[];
}
