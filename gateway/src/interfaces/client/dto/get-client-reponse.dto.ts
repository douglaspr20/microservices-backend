import { PaginationResponse } from '../../common';
import { IClient } from '../client.interface';

export class GetClientsResponseDto {
  message: string;

  data: {
    Clients: IClient[];
    PaginationResponse: PaginationResponse;
  } | null;

  errors: { [key: string]: any };
}
