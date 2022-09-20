import { IsNumberString } from 'class-validator';

export class GetSinglePatientDto {
  @IsNumberString()
  patientId: number;
}
