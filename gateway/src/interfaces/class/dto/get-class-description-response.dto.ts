import { PaginationResponse } from '../../common';
import { IClassDescription } from '../classDescription.interface';

export class GetClassDescriptionResponseDto {
  message: string;
  data: {
    PaginationResponse: PaginationResponse;
    ClassDescriptions: IClassDescription[];
  } | null;

  errors: { [key: string]: any };
}
