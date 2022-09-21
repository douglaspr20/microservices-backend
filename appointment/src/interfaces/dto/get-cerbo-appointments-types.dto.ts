import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetCerboAppointmentsTypesDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  include_deleted?: boolean;
}
