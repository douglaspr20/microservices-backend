import { IsNumber, IsString } from 'class-validator';

export class GetClassesDto {
  @IsNumber()
  limit?: number;

  @IsNumber()
  offset?: number;

  @IsNumber()
  classDescriptionId?: number;

  @IsNumber()
  programIds?: number;

  @IsNumber()
  classIds?: number;

  @IsNumber()
  staffIds?: number;

  @IsString()
  startDateTime?: string;

  @IsString()
  endDateTime?: string;

  @IsNumber()
  clientId?: number;

  @IsString()
  mindBodyAuthorization: string;
}
