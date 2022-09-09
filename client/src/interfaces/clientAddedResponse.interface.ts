import { IClient } from './client.interface';

export class IClientAddedResponse {
  status: number;
  message: string;
  data: IClient | null;
  errors: { [key: string]: any };
}
