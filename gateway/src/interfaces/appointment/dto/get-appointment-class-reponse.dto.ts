import { IClass } from 'src/interfaces/class';
import { PaginationResponse } from 'src/interfaces/common';

export class getAppointmentClassResponseDto {
  message: string;
  data?: {
    classes: IClass[];
    paginationResponse: PaginationResponse;
  } | null;
}
