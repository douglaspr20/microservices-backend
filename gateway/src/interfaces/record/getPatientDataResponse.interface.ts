import {
  IPatientBloodPressure,
  IPatientDocument,
  IPatientHeightOrWeight,
  IPatientRx,
  IPatientVaccine,
} from '../patient';

export class IGetPatientDataResponse {
  status?: number;
  message?: string;
  data?:
    | IPatientHeightOrWeight[]
    | IPatientBloodPressure[]
    | IPatientVaccine[]
    | IPatientRx[]
    | IPatientDocument[];
}
