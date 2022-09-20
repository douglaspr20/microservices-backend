import { IsNumberString } from 'class-validator';

export class DeletePatientDto {
  @IsNumberString()
  patientId: number;
}
