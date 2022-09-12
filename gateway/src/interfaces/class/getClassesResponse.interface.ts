// Generated by https://quicktype.io

import { PaginationResponse } from '../common';
import { IClass } from './class.interface';

export interface IGetClassesResponse {
  status: number;
  message: string;
  data: {
    PaginationResponse: PaginationResponse;
    Classes: IClass[];
  } | null;
  errors: { [key: string]: any };
}