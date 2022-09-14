import { IEnrollment } from './enrrollments.interface';
import { PaginationResponse } from '../common/paginationResponse.interface';

export class IGetEnrrollmentResponse {
  status: number;
  message: string;
  data: {
    PaginationResponse: PaginationResponse;
    Enrollments: IEnrollment[];
  } | null;

  errors: { [key: string]: any };
}
