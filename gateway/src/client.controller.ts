import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import {
  CreateClientDto,
  CreateClientResponseDto,
  IClientAddedResponse,
  UpdateClientDto,
} from './interfaces/client';
import { IClientUpdateResponse } from './interfaces/client/updateClientResponse.interface';
import { AppService } from './services/app.service';

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
  ): Promise<CreateClientResponseDto> {
    const createdClientResponse: IClientAddedResponse = await firstValueFrom(
      this.clientServiceClient.send('add_client', createClientDto),
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
      data: {
        ...createdClientResponse.client,
      },
      errors: null,
    };
  }

  @Put('updateclient')
  async updateClient(
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<CreateClientResponseDto> {
    const updateClientResponse: IClientUpdateResponse = await firstValueFrom(
      this.clientServiceClient.send('update_client', updateClientDto),
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
      data: {
        ...updateClientResponse.client,
      },
      errors: null,
    };
  }
}
