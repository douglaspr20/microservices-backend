import { IsNumber, IsString } from 'class-validator';

export class GetClientsDto {
  @IsNumber()
  limit?: number;

  @IsNumber()
  offset?: number;

  @IsString()
  searchText?: string;

  @IsString()
  authorization: string;
}
