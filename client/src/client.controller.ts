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
    if (!createClientDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for add client',
        data: null,
        errors: null,
      };
    }

    try {
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/addClient`,
        createClientDto,
      );

      return {
        status: HttpStatus.CREATED,
        message: 'Client Created Successfully',
        data: response.data,
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
    if (!updateClientDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for update client',
        data: null,
        errors: null,
      };
    }

    try {
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/updateclient`,
        updateClientDto,
      );

      return {
        status: HttpStatus.CREATED,
        message: 'Client Created Successfully',
        data: response.data,
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
}
