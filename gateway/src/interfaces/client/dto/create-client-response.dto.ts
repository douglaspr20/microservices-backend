import { IClient } from '../client.interface';

export class CreateClientResponseDto {
  message: string;

  data: IClient;

  errors: { [key: string]: any };
}
