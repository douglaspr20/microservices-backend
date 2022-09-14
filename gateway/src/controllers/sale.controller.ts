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
import { firstValueFrom } from 'rxjs';
import { getRequestHeaderParam } from '../decorators/getRequestHeaderParam.decorator';
import { AuthGuard } from '../guards/auth.guard';
import {
  GetProductResponseDto,
  GetProductsDto,
  IGetProductResponse,
} from '../interfaces/sale';
import { AppService } from '../services/app.service';

@UseGuards(AuthGuard)
@Controller('sale')
export class SaleController {
  constructor(
    private readonly appService: AppService,
    @Inject('SALE_SERVICE')
    private readonly saleServiceClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello('appointment');
  }

  @Get('products')
  async getProducts(
    @Query() queryParams: GetProductsDto,
    @getRequestHeaderParam('mindbodyauthorization') param: string,
  ): Promise<GetProductResponseDto> {
    const getProductsResponse: IGetProductResponse = await firstValueFrom(
      this.saleServiceClient.send('get_products', {
        ...queryParams,
        mindbodyauthorization: param,
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
