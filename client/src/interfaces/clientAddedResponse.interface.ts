import { IClient } from './client.interface';

export class IClientAddedResponse {
  status: number;
  message: string;
  client: IClient | null;
  errors: { [key: string]: any };
}
