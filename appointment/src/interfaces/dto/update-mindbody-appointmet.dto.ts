import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateMindBodyAppointmentDto {
  @IsString()
  appointmentId: string;

  @IsString()
  @IsOptional()
  mindBodyAuthorization?: string;

  @IsString()
  @IsOptional()
  genderPreference?: string;

  @IsString()
  notes: string;

  @IsString()
  @IsOptional()
  providerId?: string;

  @IsString()
  @IsOptional()
  resourceIds?: string;

  @IsBoolean()
  @IsOptional()
  sendEmail?: boolean;

  @IsString()
  @IsOptional()
  startDateTime?: string;

  @IsString()
  @IsOptional()
  endDateTime?: string;
}
