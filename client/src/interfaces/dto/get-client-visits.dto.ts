import { IsNumber, IsString } from 'class-validator';

export class GetClientVisitsDto {
  @IsNumber()
  clientId: number | string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  mindBodyAuthorization: string;
}
