import { Body, Controller, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MessagePattern } from '@nestjs/microservices';
import {
  AddClientToClassDto,
  AddClientToClassResponseDto,
  GetClassDescriptionDto,
  GetClassDescriptionResponseDto,
  GetClassesDto,
  GetClassesResponseDto,
} from './interface';
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
    if (!authorization) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for get Class Descriptions',
        data: null,
        errors: null,
      };
    }

    if (!authorization || authorization === '') {
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
        `${this.baseUrl}/classes`,
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

  @MessagePattern('class_descriptions')
  async getClassDescriptions(
    @Body() getClassDescriptionDto: GetClassDescriptionDto,
  ): Promise<GetClassDescriptionResponseDto> {
    const { authorization } = getClassDescriptionDto;

    if (!authorization) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for get Classes',
        data: null,
        errors: null,
      };
    }

    if (!authorization || authorization === '') {
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
      ...getClassDescriptionDto,
    };

    try {
      const response = await this.httpService.axiosRef.get(
        `${this.baseUrl}/classdescriptions`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Classes Descriptions Found',
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

  @MessagePattern('add_client_to_class')
  async addClientToClass(
    @Body() addClientToClassDto: AddClientToClassDto,
  ): Promise<AddClientToClassResponseDto> {
    const { authorization } = addClientToClassDto;

    if (!addClientToClassDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for add client',
        data: null,
        errors: null,
      };
    }

    if (!authorization || authorization === '') {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
        data: null,
        errors: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      authorization;

    try {
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/addclienttoclass`,
        addClientToClassDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Cliebt Added',
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
