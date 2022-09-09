import { PaginationResponse } from '../common';
import { IClassDescription } from './classDescription.interface';

export interface IGetClassDescriptionResponse {
  status: number;
  message: string;
  data: {
    PaginationResponse: PaginationResponse;
    ClassDescriptions: IClassDescription[];
  } | null;
  errors: { [key: string]: any };
}
