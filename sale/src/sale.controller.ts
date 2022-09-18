import { HttpService } from '@nestjs/axios';
import { Body, Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { GetProductResponseDto, GetProductsDto } from './interfaces';

@Controller()
export class SaleController {
  constructor(private readonly httpService: HttpService) {}

  @MessagePattern('get_products')
  async getProducts(
    @Body() getProductsDto: GetProductsDto,
  ): Promise<GetProductResponseDto> {
    const { mindbodyauthorization } = getProductsDto;

    if (!mindbodyauthorization || mindbodyauthorization === '') {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
        data: null,
        errors: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      mindbodyauthorization;

    this.httpService.axiosRef.defaults.params = {
      ...getProductsDto,
    };

    try {
      const response = await this.httpService.axiosRef.get(`/products`);

      return {
        status: HttpStatus.OK,
        message: 'Products Found',
        data: response.data,
        errors: null,
      };
    } catch (e) {
      const { response, message } = e as AxiosError;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          data: null,
          message: message,
          errors: e.errors,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        data: null,
        errors: e.errors,
      };
    }
  }
}
