import { IsOptional, IsString } from 'class-validator';

export class GetClientVisitsDto {
  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}
