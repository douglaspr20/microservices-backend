import {
  IsDateString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetMindBodyAppointmentsDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;

  @IsDateString()
  @IsOptional()
  appointmentIds?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  staffIds?: number;

  @IsNumber()
  @IsOptional()
  locationIds?: number;

  @IsString()
  mindBodyAuthorization: string;

  @IsString()
  clientId: string;
}
