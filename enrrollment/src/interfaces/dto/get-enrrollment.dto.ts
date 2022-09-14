import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetEnrrollmentsDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;

  @IsNumberString()
  @IsOptional()
  classScheduleIds?: number;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;

  @IsNumberString()
  @IsOptional()
  locationIds?: string;

  @IsNumberString()
  @IsOptional()
  programIds?: string;

  @IsNumberString()
  @IsOptional()
  sessionTypeIds?: string;

  @IsNumberString()
  @IsOptional()
  staffIds?: string;

  @IsString()
  mindbodyauthorization: string;
}
