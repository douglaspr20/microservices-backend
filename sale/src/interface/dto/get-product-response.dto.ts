import { PaginationResponse } from '../paginationResponse.interface';
import { IProduct } from '../product.interface';

export class GetProductResponseDto {
  status: number;
  message: string;
  data: {
    PaginationResponse: PaginationResponse;
    Products: IProduct[];
  } | null;

  errors: { [key: string]: any };
}
