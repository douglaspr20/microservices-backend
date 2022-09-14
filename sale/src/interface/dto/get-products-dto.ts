import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetProductsDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  offset?: number;

  @IsNumberString()
  @IsOptional()
  ProductIds?: number;

  @IsString()
  @IsOptional()
  SearchText?: string;

  @IsNumberString()
  @IsOptional()
  CategoryIds?: string;

  @IsNumberString()
  @IsOptional()
  SubCategoryIds?: string;

  @IsNumberString()
  @IsOptional()
  locationId?: number;

  @IsString()
  mindbodyauthorization: string;
}
