import { IPatient } from './patient.interface';

export class IGetPatientsResponse {
  status: number;
  message: string;
  data: {
    total_count: number;
    has_more: boolean;
    patients: IPatient[];
  } | null;

  errors: { [key: string]: any };
}
