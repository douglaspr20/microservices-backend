import { PaginationResponse } from '../paginationResponse.interface';
import { IClassDescription } from '../classDescription.interface';

export class GetClassDescriptionResponseDto {
  status: number;
  message: string;
  data: {
    PaginationResponse: PaginationResponse;
    ClassDescriptions: IClassDescription[];
  } | null;

  errors: { [key: string]: any };
}
