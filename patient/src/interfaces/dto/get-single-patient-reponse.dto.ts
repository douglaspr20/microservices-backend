import { IPatient } from '../patient.interface';

export class GetSinglePatientResponseDto {
  status: number;
  message: string;
  data: IPatient;
  errors: { [key: string]: any };
}
