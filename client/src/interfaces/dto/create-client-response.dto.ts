import { IClient } from '../client.interface';

export class CreateClientResponseDto {
  status: number;
  message: string;
  data: IClient;
  errors: { [key: string]: any };
}
