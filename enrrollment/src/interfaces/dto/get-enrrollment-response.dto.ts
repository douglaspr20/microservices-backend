import { IEnrollment } from '../enrrollments.interface';
import { PaginationResponse } from '../paginationResponse.interface';

export class GetEnrrollmentsResponseDto {
  status: number;
  message: string;
  data: {
    PaginationResponse: PaginationResponse;
    Enrollments: IEnrollment[];
  } | null;

  errors: { [key: string]: any };
}
