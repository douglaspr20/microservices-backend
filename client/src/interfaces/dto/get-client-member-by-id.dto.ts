import { IsNumber } from 'class-validator';

export class GetClientMemberDto {
  @IsNumber()
  clientId: number | string;
}
