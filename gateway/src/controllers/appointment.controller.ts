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
  GetMindBodyAppointmentsDto,
  IGetMindBodyAppointmentsResponse,
  GetMindBodyAppointmentsResponseDto,
  ISingleMindBodyAppointmentResponse,
  GetSingleMindBodyhAppointmentReponseDto,
  UpdateMindBodyAppointmentDto,
  IUpdateMindBodyAppointmentResponse,
  UpdateMindBodyAppointmentResponseDto,
} from '../interfaces/appointment';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('appointment')
export class AppointmentController {
  constructor(
    @Inject('APPOINTMENT_SERVICE')
    private readonly appoitmentServiceClient: ClientProxy,
  ) {}

  @Get()
  async getAppointments(@GetUserRequest() user: IUser): Promise<any> {
    const startDate = new Date(user.createdAt);
    const endDate = new Date();

    const yearStartDate = startDate.getFullYear();
    const monthStartDate = startDate.getMonth() + 1;
    const dateStarDate = startDate.getDate();

    const yearEndDate = endDate.getFullYear();
    const monthEndDate = endDate.getMonth() + 1;
    const dateEndDate = endDate.getDate();

    const [getMindBodyAppointmentResponse, getCerboAppointmentResponse]: [
      IGetMindBodyAppointmentsResponse,
      IGetCerboAppointmentsResponse,
    ] = await Promise.all([
      firstValueFrom(
        this.appoitmentServiceClient.send('get_mindboy_appointments', {
          mindBodyAuthorization: user.mindBodyToken,
          clientId: user.mindBodyClientId,
        }),
      ),
      firstValueFrom(
        this.appoitmentServiceClient.send('get_cerbo_appointments_range_date', {
          start_date: `${yearStartDate}-0${monthStartDate}-${dateStarDate}`,
          end_date: `${yearEndDate}-0${monthEndDate}-${dateEndDate}`,
          pt_id: user.cerboPatientId,
        }),
      ),
    ]);

    if (
      getCerboAppointmentResponse.status !== HttpStatus.OK &&
      getMindBodyAppointmentResponse.status !== HttpStatus.OK
    ) {
      throw new HttpException(
        {
          message: 'Something went wrong',
          data: null,
          errors: getCerboAppointmentResponse.errors,
        },
        getCerboAppointmentResponse.status,
      );
    }

    return {
      healthAppointments: getCerboAppointmentResponse.data
        ? getCerboAppointmentResponse.data?.appointments
        : [],
      wellnessAppointments: getMindBodyAppointmentResponse.data
        ? getMindBodyAppointmentResponse.data.Appointments
        : [],
    };
  }

  @Get('health')
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

  @Get('health/type')
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

  @Get('health/:appointmentId')
  async getSingleAppointmentWellness(
    @Param('appointmentId') appointmentId: number,
  ): Promise<GetSingleCerboAppointmentResponseDto> {
    const getSingleCerboAppointmentResponse: ISingleCerboAppointmentResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('get_cerbo_single_appointment', {
          appointmentId,
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

  @Post('health')
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

  @Put('health/:appointmentId')
  async updateAppointmentHealth(
    @Param('appointmentId') appointmentId: number,
    @Body() updateCerboAppointmentDto: UpdateCerboAppointmentDto,
  ): Promise<UpdateCerboAppointmentResponseDto> {
    const updateAppoimentCerboResponse: IUpdateCerboAppointmentResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('update_cerbo_appointment', {
          ...updateCerboAppointmentDto,
          appointmentId,
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

  @Delete('health/:appointmentId')
  async deleteAppointmentWellness(
    @Param('appointmentId') appointmentId: number,
  ): Promise<DeleteCerboAppointmentResponseDto> {
    const deleteAppoimentCerboResponse: IDeleteCerboAppointmentResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('delete_cerbo_appointment', {
          appointmentId,
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

  @Get('wellness')
  async getAppointmentsHealth(
    @Query() getMindBodyAppointmentsDto: GetMindBodyAppointmentsDto,
    @GetUserRequest() user: IUser,
  ): Promise<GetMindBodyAppointmentsResponseDto> {
    const getMindBodyAppointmentResponse: IGetMindBodyAppointmentsResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('get_mindboy_appointments', {
          ...getMindBodyAppointmentsDto,
          mindBodyAuthorization: user.mindBodyToken,
          clientId: user.mindBodyClientId,
        }),
      );

    if (getMindBodyAppointmentResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getMindBodyAppointmentResponse.message,
        },
        getMindBodyAppointmentResponse.status,
      );
    }

    return {
      message: getMindBodyAppointmentResponse.message,
      data: {
        healthAppointments: getMindBodyAppointmentResponse.data.Appointments,
        paginationResponse:
          getMindBodyAppointmentResponse.data.PaginationResponse,
      },
    };
  }

  @Post('wellness')
  async addAppointment(
    @Body() addAppointmentDto: AddAppointmentDto,
    @GetUserRequest() user: IUser,
  ): Promise<AddAppointmentResponseDto> {
    const addAppoimentResponse: IAppointmentAddedResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('add_appointment', {
          ...addAppointmentDto,
          mindBodyAuthorization: user.mindBodyToken,
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

  @Get('wellness/:appointmentId')
  async getSingleAppointmentHealth(
    @Param('appointmentId') appointmentId: number,
    @GetUserRequest() user: IUser,
  ): Promise<GetSingleMindBodyhAppointmentReponseDto> {
    const getSingleMindBodyAppointmentResponse: ISingleMindBodyAppointmentResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('get_single_mindboy_appointment', {
          appointmentId,
          mindBodyAuthorization: user.mindBodyToken,
        }),
      );

    if (getSingleMindBodyAppointmentResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getSingleMindBodyAppointmentResponse.message,
        },
        getSingleMindBodyAppointmentResponse.status,
      );
    }

    return {
      data: getSingleMindBodyAppointmentResponse.data,
    };
  }

  @Put('wellness/:appointmentId')
  async updateAppointmentWellness(
    @Param('appointmentId') appointmentId: number,
    @Body() updateMindBodyAppointmentDto: UpdateMindBodyAppointmentDto,
    @GetUserRequest() user: IUser,
  ): Promise<UpdateMindBodyAppointmentResponseDto> {
    const updateMindBodyAppointmentResponse: IUpdateMindBodyAppointmentResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('update_mindboy_appointment', {
          appointmentId,
          mindBodyAuthorization: user.mindBodyToken,
          ...updateMindBodyAppointmentDto,
        }),
      );

    if (updateMindBodyAppointmentResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updateMindBodyAppointmentResponse.message,
        },
        updateMindBodyAppointmentResponse.status,
      );
    }

    return {
      data: updateMindBodyAppointmentResponse.data,
    };
  }
}
