import { IPatient } from '../patient.interface';

export class GetPatientsResponseDto {
  message: string;
  data: {
    total_count: number;
    has_more: boolean;
    patients: IPatient[];
  } | null;

  errors: { [key: string]: any };
}
