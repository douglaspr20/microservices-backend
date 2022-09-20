export class IDeletePatientResponse {
  status: number;
  message: string;
  errors: { [key: string]: any };
}
