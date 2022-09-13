import { IClient } from '../client.interface';

export class GetClientMemberByIdResponseDto {
  status: number;
  message: string;
  data: IClient;
  errors: { [key: string]: any };
}
