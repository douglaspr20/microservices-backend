import { IPatientDocument } from './patientDocument.interface';

export interface IGetDocumentsPatient {
  object: string;
  total_count: number;
  has_more: boolean;
  data: IPatientDocument[];
}
