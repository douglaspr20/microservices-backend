import { IClient } from './client.interface';

export class IClientUpdateResponse {
  status: number;
  message: string;
  data: IClient | null;
  errors: { [key: string]: any };
}
