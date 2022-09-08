import { IClient } from './client.interface';

export class IClientUpdateResponse {
  status: number;
  message: string;
  client: IClient | null;
  errors: { [key: string]: any };
}
