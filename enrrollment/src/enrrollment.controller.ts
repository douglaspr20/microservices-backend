import { HttpService } from '@nestjs/axios';
import { Body, Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { GetEnrrollmentsDto, GetEnrrollmentsResponseDto } from './interfaces';

@Controller()
export class EnrrollmentController {
  constructor(private readonly httpService: HttpService) {}

  @MessagePattern('get_enrrollments')
  async getEnrrollmnets(
    @Body() getEnrrollmentsDto: GetEnrrollmentsDto,
  ): Promise<GetEnrrollmentsResponseDto> {
    const { mindbodyauthorization } = getEnrrollmentsDto;

    if (!mindbodyauthorization) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for get Products',
        data: null,
        errors: null,
      };
    }

    if (!mindbodyauthorization || mindbodyauthorization === '') {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'forbidden resource',
        data: null,
        errors: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      mindbodyauthorization;

    this.httpService.axiosRef.defaults.params = {
      ...getEnrrollmentsDto,
    };

    try {
      const response = await this.httpService.axiosRef.get(`/enrollments`);

      return {
        status: HttpStatus.OK,
        message: 'Enrrollments Founds',
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
