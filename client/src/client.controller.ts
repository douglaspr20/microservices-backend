import { Controller, Body, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { MessagePattern } from '@nestjs/microservices';
import { ConfigService } from './services/config.service';
import {
  CreateClientDto,
  CreateClientResponseDto,
  UpdateClientDto,
} from './interfaces';

@Controller()
export class ClientController {
  baseUrl = `${this.configService.get('mindbodyBaseUrl')}/client`;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @MessagePattern('add_client')
  async addClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<CreateClientResponseDto> {
    const { authorization } = createClientDto;
    if (!createClientDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for add client',
        data: null,
        errors: null,
      };
    }

    if (!createClientDto.authorization) {
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
        `${this.baseUrl}/addClient`,
        createClientDto,
      );

      return {
        status: HttpStatus.CREATED,
        message: 'Client Created Successfully',
        data: response.data.Client,
        errors: null,
      };
    } catch (e) {
      console.log(e);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        data: null,
        errors: e.errors,
      };
    }
  }

  @MessagePattern('update_client')
  async updateClient(
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<CreateClientResponseDto> {
    const { authorization } = updateClientDto;

    if (!updateClientDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for update client',
        data: null,
        errors: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      authorization;

    try {
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/updateclient`,
        updateClientDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Client Updated Successfully',
        data: response.data.Client,
        errors: null,
      };
    } catch (e) {
      console.log(e.response);

      if (e.response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: e.response.status as number,
          data: null,
          message: e.response.data.Error.Message as string,
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
