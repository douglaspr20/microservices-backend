import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetPatientsDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
