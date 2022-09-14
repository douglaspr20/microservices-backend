import { PaginationResponse } from '../common/paginationResponse.interface';
import { IProduct } from './product.interface';

export class IGetProductResponse {
  status: number;
  message: string;
  data: {
    PaginationResponse: PaginationResponse;
    Products: IProduct[];
  } | null;

  errors: { [key: string]: any };
}
