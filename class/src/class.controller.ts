import { Body, Controller, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MessagePattern } from '@nestjs/microservices';
import { GetClassesDto, GetClassesResponseDto } from './interface';
import { ConfigService } from './services/config.service';
import { AxiosError } from 'axios';

@Controller()
export class ClassController {
  baseUrl = `${this.configService.get('mindbodyBaseUrl')}/class`;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @MessagePattern('get_classes')
  async getClasses(
    @Body() getClassesDto: GetClassesDto,
  ): Promise<GetClassesResponseDto> {
    const { authorization } = getClassesDto;
    if (!getClassesDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for get Classes',
        data: null,
        errors: null,
      };
    }

    if (!getClassesDto.authorization || getClassesDto.authorization === '') {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
        data: null,
        errors: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      authorization;

    this.httpService.axiosRef.defaults.params = {
      ...getClassesDto,
    };

    try {
      const response = await this.httpService.axiosRef.get(
        `${this.baseUrl}/clients`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Classes Found',
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
