import { Body, Controller, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MessagePattern } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import {
  AddClientToClassDto,
  AddClientToClassResponseDto,
  GetClassDescriptionDto,
  GetClassDescriptionResponseDto,
  GetClassesDto,
  GetClassesResponseDto,
} from './interface';
import { MindBodyErrorResponse } from './types';

@Controller()
export class ClassController {
  constructor(private readonly httpService: HttpService) {}

  @MessagePattern('get_classes')
  async getClasses(
    @Body() getClassesDto: GetClassesDto,
  ): Promise<GetClassesResponseDto> {
    const { mindBodyAuthorization } = getClassesDto;
    if (!mindBodyAuthorization) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for get Class Descriptions',
        data: null,
        errors: null,
      };
    }

    if (!mindBodyAuthorization || mindBodyAuthorization === '') {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'forbidden resource',
        data: null,
        errors: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      mindBodyAuthorization;

    this.httpService.axiosRef.defaults.params = {
      ...getClassesDto,
    };

    try {
      const response = await this.httpService.axiosRef.get(`/classes`);

      return {
        status: HttpStatus.OK,
        message: 'Classes Found',
        data: response.data,
        errors: null,
      };
    } catch (e) {
      const { response } = e as AxiosError;
      const { Error } = response.data as MindBodyErrorResponse;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          data: null,
          message: Error.Message,
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
    const { mindBodyAuthorization } = getClassDescriptionDto;

    if (!mindBodyAuthorization) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for get Classes',
        data: null,
        errors: null,
      };
    }

    if (!mindBodyAuthorization || mindBodyAuthorization === '') {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'forbidden resource',
        data: null,
        errors: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      mindBodyAuthorization;

    this.httpService.axiosRef.defaults.params = {
      ...getClassDescriptionDto,
    };

    try {
      const response = await this.httpService.axiosRef.get(
        `/classdescriptions`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Classes Descriptions Found',
        data: response.data,
        errors: null,
      };
    } catch (e) {
      const { response } = e as AxiosError;
      const { Error } = response.data as MindBodyErrorResponse;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          data: null,
          message: Error.Message,
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
    const { mindBodyAuthorization } = addClientToClassDto;

    if (!addClientToClassDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for add client',
        data: null,
        errors: null,
      };
    }

    if (!mindBodyAuthorization || mindBodyAuthorization === '') {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'forbidden resource',

        data: null,
        errors: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      mindBodyAuthorization;

    try {
      const response = await this.httpService.axiosRef.post(
        `/addclienttoclass`,
        addClientToClassDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Client Added',
        data: response.data,
        errors: null,
      };
    } catch (e) {
      const { response } = e as AxiosError;
      const { Error } = response.data as MindBodyErrorResponse;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          data: null,
          message: Error.Message,
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
