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
import { getRequestHeaderParam } from '../decorators/getRequestHeaderParam.decorator';
import { AuthGuard } from '../guards/auth.guard';
import {
  AddAppointmentDto,
  IAppointmentAddedResponse,
} from '../interfaces/appointment';
import { AppService } from '../services/app.service';

@UseGuards(AuthGuard)
@Controller('appointment')
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

  @Post('addAppointment')
  async addAppointment(
    @Body() addAppointmentDto: AddAppointmentDto,
    @getRequestHeaderParam('mindbodyauthorization') param: string,
  ) {
    const addAppoimentResponse: IAppointmentAddedResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('add_appointment', {
          ...addAppointmentDto,
          mindbodyauthorization: param,
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
