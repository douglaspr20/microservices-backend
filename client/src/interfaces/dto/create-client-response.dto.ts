import { IClient } from '../client.interface';

export class CreateClientResponseDto {
  status?: number;
  message: string;
  data: IClient | null;
  errors: { [key: string]: any };
}
