import { IClient } from '../client.interface';

export interface GetClientsResponseDto {
  status: number;
  message: string;
  data: {
    PaginationResponse: PaginationResponse;
    Clients: IClient[];
  } | null;
  errors: { [key: string]: any };
}

export interface PaginationResponse {
  RequestedLimit: number;
  RequestedOffset: number;
  PageSize: number;
  TotalResults: number;
}
