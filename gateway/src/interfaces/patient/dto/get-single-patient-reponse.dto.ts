import { IPatient } from '../patient.interface';

export class GetSinglePatientResponseDto {
  message: string;
  data: IPatient;
  errors: { [key: string]: any };
}
