import { PaginationResponse } from '../paginationResponse.interface';
import { IClass } from '../class.interface';

export class GetClassesResponseDto {
  status: number;
  message: string;
  data: {
    Classes: IClass[];
    PaginationResponse: PaginationResponse;
  } | null;

  errors: { [key: string]: any };
}
