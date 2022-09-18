import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetRequestHeaderParam } from '../decorators/getRequestHeaderParam.decorator';
import { AuthGuard } from '../guards/auth.guard';
import {
  CreateClientDto,
  CreateClientResponseDto,
  GetClientsResponseDto,
  IClientAddedResponse,
  IGetClientsResponse,
  UpdateClientDto,
  IClientUpdateResponse,
} from '../interfaces/client';
import { AppService } from '../services/app.service';

@UseGuards(AuthGuard)
@Controller('client')
export class ClientController {
  constructor(
    private readonly appService: AppService,
    @Inject('CLIENT_SERVICE') private readonly clientServiceClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello('client');
  }

  @Post('addClient')
  async addClient(
    @Body() createClientDto: CreateClientDto,
    @GetRequestHeaderParam('mindbodyauthorization') param: string,
  ): Promise<CreateClientResponseDto> {
    const createdClientResponse: IClientAddedResponse = await firstValueFrom(
      this.clientServiceClient.send('add_client', {
        ...createClientDto,
        mindbodyauthorization: param,
      }),
    );

    if (createdClientResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createdClientResponse.message,
          data: null,
          errors: createdClientResponse.errors,
        },
        createdClientResponse.status,
      );
    }

    return {
      message: createdClientResponse.message,
      data: createdClientResponse.data,
      errors: null,
    };
  }

  @Get('clients')
  async getClients(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('searchText') searchText: string,
    @GetRequestHeaderParam('mindbodyauthorization') param: string,
  ): Promise<GetClientsResponseDto> {
    const getClientsReponse: IGetClientsResponse = await firstValueFrom(
      this.clientServiceClient.send('get_clients', {
        limit,
        offset,
        searchText,
        mindbodyauthorization: param,
      }),
    );

    if (getClientsReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getClientsReponse.message,
          data: null,
          errors: getClientsReponse.errors,
        },
        getClientsReponse.status,
      );
    }

    return {
      message: getClientsReponse.message,
      data: getClientsReponse.data,
      errors: null,
    };
  }

  @Put('updateClient')
  async updateClient(
    @Body() updateClientDto: UpdateClientDto,
    @GetRequestHeaderParam('mindbodyauthorization') param: string,
  ): Promise<CreateClientResponseDto> {
    const updateClientResponse: IClientUpdateResponse = await firstValueFrom(
      this.clientServiceClient.send('update_client', {
        ...updateClientDto,
        mindBodyAuthorization: param,
      }),
    );

    if (updateClientResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateClientResponse.message,
          data: null,
          errors: updateClientResponse.errors,
        },
        updateClientResponse.status,
      );
    }

    return {
      message: updateClientResponse.message,
      data: updateClientResponse.data,
      errors: null,
    };
  }
}
