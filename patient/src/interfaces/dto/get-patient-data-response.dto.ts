import { IPatientBloodPressure } from '../patientBloodPressure.interface';
import { IPatientDocument } from '../patientDocument.interface';
import { IPatientHeightOrWeight } from '../patientHeightWeight.interface';
import { IPatientRx } from '../patientRx.interface';
import { IPatientVaccine } from '../patientVaccine.interface';

export class GetPatientDataResponseDto {
  status?: number;
  message?: string;
  data?:
    | IPatientHeightOrWeight[]
    | IPatientBloodPressure[]
    | IPatientVaccine[]
    | IPatientRx[]
    | IPatientDocument[];
}
