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
  Param,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';
import { GetUserRequest } from '../decorators';
import { IUser } from '../interfaces/user';
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

@UseGuards(AuthGuard('jwt'))
@Controller('clients')
export class ClientController {
  constructor(
    private readonly appService: AppService,
    @Inject('CLIENT_SERVICE') private readonly clientServiceClient: ClientProxy,
  ) {}

  @Post()
  async addClient(
    @Body() createClientDto: CreateClientDto,
    @GetUserRequest() user: IUser,
  ): Promise<CreateClientResponseDto> {
    const createdClientResponse: IClientAddedResponse = await firstValueFrom(
      this.clientServiceClient.send('add_client', {
        ...createClientDto,
        mindbodyauthorization: user.mindBodyToken,
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

  @Get()
  async getClients(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('searchText') searchText: string,
    @GetUserRequest() user: IUser,
  ): Promise<GetClientsResponseDto> {
    const getClientsReponse: IGetClientsResponse = await firstValueFrom(
      this.clientServiceClient.send('get_clients', {
        limit,
        offset,
        searchText,
        mindbodyauthorization: user.mindBodyToken,
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

  @Get(':clientId')
  async getClientById(
    @Param('clientId') clientId: number,
    @GetUserRequest() user: IUser,
  ): Promise<any> {
    const getClientReponse: IGetClientsResponse = await firstValueFrom(
      this.clientServiceClient.send('get_client_by_id', {
        clientId,
        mindbodyauthorization: user.mindBodyToken,
      }),
    );

    if (getClientReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getClientReponse.message,
          data: null,
          errors: getClientReponse.errors,
        },
        getClientReponse.status,
      );
    }

    return {
      message: getClientReponse.message,
      data: getClientReponse.data,
      errors: null,
    };
  }

  @Put(':clientId')
  async updateClient(
    @Param('clientId') clientId: number,
    @Body() updateClientDto: UpdateClientDto,
    @GetUserRequest() user: IUser,
  ): Promise<CreateClientResponseDto> {
    const updateClientResponse: IClientUpdateResponse = await firstValueFrom(
      this.clientServiceClient.send('update_client', {
        ...updateClientDto,
        clientId,
        mindBodyAuthorization: user.mindBodyToken,
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
