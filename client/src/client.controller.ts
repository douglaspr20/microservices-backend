import { Controller, Body, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreateClientDto,
  CreateClientResponseDto,
  GetClientMemberByIdResponseDto,
  GetClientMemberDto,
  GetClientsDto,
  GetClientsResponseDto,
  UpdateClientDto,
} from './interfaces';

@Controller()
export class ClientController {
  constructor(private readonly httpService: HttpService) {}

  @MessagePattern('add_client')
  async addClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<CreateClientResponseDto> {
    const { mindbodyauthorization } = createClientDto;
    if (!createClientDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for add client',
        data: null,
        errors: null,
      };
    }

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

    try {
      const response = await this.httpService.axiosRef.post(
        `/addClient`,
        createClientDto,
      );

      return {
        status: HttpStatus.CREATED,
        message: 'Client Created Successfully',
        data: response.data.Client,
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

  @MessagePattern('get_clients')
  async getClients(
    @Body() getclientsDto: GetClientsDto,
  ): Promise<GetClientsResponseDto> {
    const {
      limit = 100,
      offset = 0,
      mindbodyauthorization,
      searchText = '',
    } = getclientsDto;

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
      limit,
      offset,
      searchText,
    };

    try {
      const response = await this.httpService.axiosRef.get(`/clients`);

      return {
        status: HttpStatus.OK,
        message: 'Clients Found',
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

  @MessagePattern('update_client')
  async updateClient(
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<CreateClientResponseDto> {
    const { mindbodyauthorization } = updateClientDto;

    if (!updateClientDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for update client',
        data: null,
        errors: null,
      };
    }

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

    try {
      const response = await this.httpService.axiosRef.post(
        `/updateclient`,
        updateClientDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Client Updated Successfully',
        data: response.data.Client,
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

  @MessagePattern('get_client_by_id')
  async getClientById(
    @Body() getClientMemberDto: GetClientMemberDto,
  ): Promise<GetClientMemberByIdResponseDto> {
    const { clientId } = getClientMemberDto;

    this.httpService.axiosRef.defaults.params = {
      clientId,
    };

    try {
      const response = await this.httpService.axiosRef.get(
        `/clientcompleteinfo`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Client Found',
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
