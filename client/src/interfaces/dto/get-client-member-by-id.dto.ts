import { IsNumber, IsString } from 'class-validator';

export class GetClientMemberDto {
  @IsNumber()
  clientId: number | string;

  @IsString()
  mindbodyauthorization: string;
}
