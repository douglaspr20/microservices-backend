// Generated by https://quicktype.io

import { PaginationResponse } from '../common';
import { IClient } from './client.interface';

export interface IGetClientsResponse {
  status: number;
  message: string;
  data: {
    PaginationResponse: PaginationResponse;
    Clients: IClient[];
  } | null;
  errors: { [key: string]: any };
}
