import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetUserRequest } from '../decorators';
import { IUser } from '../interfaces/user';
import { AuthGuard } from '../guards/auth.guard';
import {
  AddAppointmentDto,
  IAppointmentAddedResponse,
} from '../interfaces/appointment';
import { AppService } from '../services/app.service';

@UseGuards(AuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appService: AppService,
    @Inject('APPOINTMENT_SERVICE')
    private readonly appoitmentServiceClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello('appointment');
  }

  @Post()
  async addAppointment(
    @Body() addAppointmentDto: AddAppointmentDto,
    @GetUserRequest() user: IUser,
  ) {
    const addAppoimentResponse: IAppointmentAddedResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('add_appointment', {
          ...addAppointmentDto,
          mindBodyAuthorization: user.MindBodyToken,
        }),
      );

    if (addAppoimentResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: addAppoimentResponse.message,
          data: null,
          errors: addAppoimentResponse.errors,
        },
        addAppoimentResponse.status,
      );
    }

    return {
      message: addAppoimentResponse.message,
      data: addAppoimentResponse.data,
      errors: null,
    };
  }
}
