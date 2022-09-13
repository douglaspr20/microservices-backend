import { IsNumberString, IsString } from 'class-validator';

export class GetClassDescriptionDto {
  @IsNumberString()
  limit?: number;

  @IsNumberString()
  offset?: number;

  @IsNumberString()
  classDescriptionId?: number;

  @IsNumberString()
  programIds?: number;

  @IsString()
  startClassDateTime?: string;

  @IsString()
  endClassDateTime?: string;

  @IsNumberString()
  staffId?: number;

  @IsNumberString()
  locationId?: number;

  @IsString()
  mindbodyauthorization: string;
}
