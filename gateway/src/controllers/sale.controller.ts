import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';
import { GetUserRequest } from '../decorators';
import { IUser } from '../interfaces/user';

import {
  GetProductResponseDto,
  GetProductsDto,
  IGetProductResponse,
} from '../interfaces/sale';

@UseGuards(AuthGuard('jwt'))
@Controller('sales')
export class SaleController {
  constructor(
    @Inject('SALE_SERVICE')
    private readonly saleServiceClient: ClientProxy,
  ) {}

  @Get('products')
  async getProducts(
    @Query() queryParams: GetProductsDto,
    @GetUserRequest() user: IUser,
  ): Promise<GetProductResponseDto> {
    const getProductsResponse: IGetProductResponse = await firstValueFrom(
      this.saleServiceClient.send('get_products', {
        ...queryParams,
        mindBodyAuthorization: user.MindBodyToken,
      }),
    );

    if (getProductsResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getProductsResponse.message,
          data: null,
          errors: getProductsResponse.errors,
        },
        getProductsResponse.status,
      );
    }

    return {
      message: getProductsResponse.message,
      data: getProductsResponse.data,
      errors: null,
    };
  }
}
