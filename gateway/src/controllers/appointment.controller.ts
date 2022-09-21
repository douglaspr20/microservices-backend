import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetUserRequest } from '../decorators';
import { IUser } from '../interfaces/user';
import { AuthGuard } from '../guards/auth.guard';
import {
  AddAppointmentCerboResponseDto,
  AddAppointmentDto,
  AddAppointmentResponseDto,
  AddCerboAppointmentDto,
  GetSingleCerboAppointmentResponseDto,
  IAddedCerboAppointment,
  IAppointmentAddedResponse,
  IGetCerboAppointmentsResponse,
  GetCerboAppointmentsDto,
  ISingleCerboAppointmentResponse,
  UpdateCerboAppointmentDto,
  IUpdateCerboAppointmentResponse,
  UpdateCerboAppointmentResponseDto,
  IDeleteCerboAppointmentResponse,
  DeleteCerboAppointmentResponseDto,
  GetCerboAppointmentsTypesDto,
  GetCerboAppointmentsTypesResponseDto,
  IGetCerboAppointmentsTypesResponse,
} from '../interfaces/appointment';

@UseGuards(AuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(
    @Inject('APPOINTMENT_SERVICE')
    private readonly appoitmentServiceClient: ClientProxy,
  ) {}

  @Post()
  async addAppointment(
    @Body() addAppointmentDto: AddAppointmentDto,
    @GetUserRequest() user: IUser,
  ): Promise<AddAppointmentResponseDto> {
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

  @Get('wellness')
  async getAppointmentsWellness(@Query() queryParams: GetCerboAppointmentsDto) {
    const getCerboAppointmentResponse: IGetCerboAppointmentsResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('get_cerbo_appointments_range_date', {
          ...queryParams,
        }),
      );

    if (getCerboAppointmentResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getCerboAppointmentResponse.message,
          data: null,
          errors: getCerboAppointmentResponse.errors,
        },
        getCerboAppointmentResponse.status,
      );
    }

    return {
      message: getCerboAppointmentResponse.message,
      data: getCerboAppointmentResponse.data,
      errors: null,
    };
  }

  @Get('wellness/:appointment_id')
  async getSingleAppointmentWellness(
    @Param() appointment_id: number,
  ): Promise<GetSingleCerboAppointmentResponseDto> {
    const getSingleCerboAppointmentResponse: ISingleCerboAppointmentResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('get_cerbo_single_appointment', {
          appointment_id,
        }),
      );
    if (getSingleCerboAppointmentResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getSingleCerboAppointmentResponse.message,
          data: null,
          errors: getSingleCerboAppointmentResponse.errors,
        },
        getSingleCerboAppointmentResponse.status,
      );
    }
    return {
      message: getSingleCerboAppointmentResponse.message,
      data: getSingleCerboAppointmentResponse.data,
      errors: null,
    };
  }

  @Post('wellness')
  async addAppointmentWellness(
    @Body() addCerboAppointmentDto: AddCerboAppointmentDto,
  ): Promise<AddAppointmentCerboResponseDto> {
    const addedAppoimentCerboResponse: IAddedCerboAppointment =
      await firstValueFrom(
        this.appoitmentServiceClient.send('add_cerbo_appointment', {
          ...addCerboAppointmentDto,
        }),
      );

    if (addedAppoimentCerboResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: addedAppoimentCerboResponse.message,
          data: null,
          errors: addedAppoimentCerboResponse.errors,
        },
        addedAppoimentCerboResponse.status,
      );
    }

    return {
      message: addedAppoimentCerboResponse.message,
      data: addedAppoimentCerboResponse.data,
      errors: null,
    };
  }

  @Put('wellness/:appointment_id')
  async updateAppointmentWellness(
    @Param() appointment_id: number,
    @Body() updateCerboAppointmentDto: UpdateCerboAppointmentDto,
  ): Promise<UpdateCerboAppointmentResponseDto> {
    const updateAppoimentCerboResponse: IUpdateCerboAppointmentResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('update_cerbo_appointment', {
          ...updateCerboAppointmentDto,
          appointment_id,
        }),
      );

    if (updateAppoimentCerboResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateAppoimentCerboResponse.message,
          data: null,
          errors: updateAppoimentCerboResponse.errors,
        },
        updateAppoimentCerboResponse.status,
      );
    }

    return {
      message: updateAppoimentCerboResponse.message,
      data: updateAppoimentCerboResponse.data,
      errors: null,
    };
  }

  @Delete('wellness/:appointment_id')
  async deleteAppointmentWellness(
    @Param() appointment_id: number,
  ): Promise<DeleteCerboAppointmentResponseDto> {
    const deleteAppoimentCerboResponse: IDeleteCerboAppointmentResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('delete_cerbo_appointment', {
          appointment_id,
        }),
      );

    if (deleteAppoimentCerboResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: deleteAppoimentCerboResponse.message,
          errors: deleteAppoimentCerboResponse.errors,
        },
        deleteAppoimentCerboResponse.status,
      );
    }

    return {
      message: deleteAppoimentCerboResponse.message,
      errors: null,
    };
  }

  @Get('wellness/types')
  async getAppointmentWellnessTypes(
    @Query() queryParams: GetCerboAppointmentsTypesDto,
  ): Promise<GetCerboAppointmentsTypesResponseDto> {
    const getCerboAppointmentTypeResponse: IGetCerboAppointmentsTypesResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('get_cerbo_appointments_types', {
          ...queryParams,
        }),
      );

    if (getCerboAppointmentTypeResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getCerboAppointmentTypeResponse.message,
          data: null,
          errors: getCerboAppointmentTypeResponse.errors,
        },
        getCerboAppointmentTypeResponse.status,
      );
    }

    return {
      message: getCerboAppointmentTypeResponse.message,
      data: getCerboAppointmentTypeResponse.data,
      errors: null,
    };
  }
}
