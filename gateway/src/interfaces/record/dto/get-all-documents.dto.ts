import { IsNumberString, IsOptional } from 'class-validator';

export class GetAllDocumentsDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;
}
