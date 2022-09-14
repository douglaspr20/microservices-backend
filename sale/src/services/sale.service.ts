import { Injectable } from '@nestjs/common';

@Injectable()
export class SaleService {
  getHello(): string {
    return 'Hello World!';
  }
}
