import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class getClassDescriptionDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;

  @IsNumberString()
  @IsOptional()
  classDescriptionId?: number;

  @IsNumberString()
  @IsOptional()
  programIds?: number;

  @IsString()
  @IsOptional()
  startClassDateTime?: string;

  @IsString()
  @IsOptional()
  endClassDateTime?: string;

  @IsNumberString()
  @IsOptional()
  staffId?: number;

  @IsNumberString()
  @IsOptional()
  locationId?: number;
}
