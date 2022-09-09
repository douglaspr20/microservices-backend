import { PaginationResponse } from '../../common';
import { IClass } from '../class.interface';

export class GetClassesResponseDto {
  message: string;

  data: {
    Classes: IClass[];
    PaginationResponse: PaginationResponse;
  } | null;

  errors: { [key: string]: any };
}
