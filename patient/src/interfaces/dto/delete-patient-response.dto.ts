export class DeletePatientResponseDto {
  status: number;
  message: string;
  errors: { [key: string]: any };
}
