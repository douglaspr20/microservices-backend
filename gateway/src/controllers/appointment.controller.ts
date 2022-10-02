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
  IAddedCerboAppointment,
  IAppointmentAddedResponse,
  IGetCerboAppointmentsResponse,
  GetCerboAppointmentsDto,
  ISingleCerboAppointmentResponse,
  UpdateCerboAppointmentDto,
  IUpdateCerboAppointmentResponse,
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
  getAppointmentClassResponseDto,
  IAppointCerboResponse,
} from '../interfaces/appointment';
import { AuthGuard } from '@nestjs/passport';
import {
  AddClientToClassDto,
  AddClientToClassResponseDto,
  IAddClientToClassResponse,
  IClass,
  IGetClassesResponse,
} from '../interfaces/class';
import {
  formatHealthAppointment,
  formatHealthAppointmentArray,
} from 'src/utils';

@UseGuards(AuthGuard('jwt'))
@Controller('appointment')
export class AppointmentController {
  constructor(
    @Inject('APPOINTMENT_SERVICE')
    private readonly appoitmentServiceClient: ClientProxy,
    @Inject('CLASS_SERVICE')
    private readonly classServiceClient: ClientProxy,
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

    const [
      getMindBodyAppointmentResponse,
      getCerboAppointmentResponse,
      getClassesAppointmentResponse,
    ]: [
      IGetMindBodyAppointmentsResponse,
      IGetCerboAppointmentsResponse,
      IGetClassesResponse,
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
      firstValueFrom(
        this.classServiceClient.send('get_classes', {
          clientId: user.mindBodyClientId,
          mindBodyAuthorization: user.mindBodyToken,
        }),
      ),
    ]);

    if (
      getCerboAppointmentResponse.status !== HttpStatus.OK &&
      getMindBodyAppointmentResponse.status !== HttpStatus.OK &&
      getClassesAppointmentResponse.status !== HttpStatus.OK
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
        ? formatHealthAppointmentArray(
            getCerboAppointmentResponse.data?.appointments,
          )
        : [],
      wellnessAppointments: getMindBodyAppointmentResponse.data
        ? getMindBodyAppointmentResponse.data.Appointments
        : [],
      classes: getClassesAppointmentResponse.data
        ? getClassesAppointmentResponse.data.Classes
        : [],
    };
  }

  @Get('health')
  async getAppointmentsHealth(
    @Query() queryParams: GetCerboAppointmentsDto,
    @GetUserRequest() user: IUser,
  ) {
    const getCerboAppointmentResponse: IGetCerboAppointmentsResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('get_cerbo_appointments_range_date', {
          ...queryParams,
          pt_id: user.cerboPatientId,
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
      healthAppointments: formatHealthAppointmentArray(
        getCerboAppointmentResponse.data.appointments,
      ),
      errors: null,
    };
  }

  @Get('health/type')
  async getAppointmentHealthTypes(
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
  async getSingleAppointmentHealth(
    @Param('appointmentId') appointmentId: number,
  ): Promise<IAppointCerboResponse> {
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
    return formatHealthAppointment(getSingleCerboAppointmentResponse.data);
  }

  @Post('health')
  async addAppointmentHealth(
    @Body() addCerboAppointmentDto: AddCerboAppointmentDto,
    @GetUserRequest() user: IUser,
  ): Promise<AddAppointmentCerboResponseDto> {
    const addedAppoimentCerboResponse: IAddedCerboAppointment =
      await firstValueFrom(
        this.appoitmentServiceClient.send('add_cerbo_appointment', {
          title: addCerboAppointmentDto.title,
          status: addCerboAppointmentDto.appointmentStatus,
          provider_ids: addCerboAppointmentDto.providers,
          telemedicine: addCerboAppointmentDto.telemedicine,
          start_date_time: addCerboAppointmentDto.startDateTime,
          end_date_time: addCerboAppointmentDto.endDateTime,
          appointment_type: addCerboAppointmentDto.appointmentType,
          appointment_note: addCerboAppointmentDto.appointmentNote,
          pt_id: user.cerboPatientId,
        }),
      );

    if (addedAppoimentCerboResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: addedAppoimentCerboResponse.message,
          data: null,
        },
        addedAppoimentCerboResponse.status,
      );
    }

    return {
      message: addedAppoimentCerboResponse.message,
      data: formatHealthAppointment(addedAppoimentCerboResponse.data),
    };
  }

  @Put('health/:appointmentId')
  async updateAppointmentHealth(
    @Param('appointmentId') appointmentId: number,
    @Body() updateCerboAppointmentDto: UpdateCerboAppointmentDto,
  ): Promise<IAppointCerboResponse> {
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

    return formatHealthAppointment(updateAppoimentCerboResponse.data);
  }

  @Delete('health/:appointmentId')
  async deleteAppointmentHealth(
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
  async getAppointmentsWellness(
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
        wellnessAppointments: getMindBodyAppointmentResponse.data.Appointments,
        paginationResponse:
          getMindBodyAppointmentResponse.data.PaginationResponse,
      },
    };
  }

  @Post('wellness')
  async addAppointmentWellness(
    @Body() addAppointmentDto: AddAppointmentDto,
    @GetUserRequest() user: IUser,
  ): Promise<AddAppointmentResponseDto> {
    const addAppoimentResponse: IAppointmentAddedResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('add_appointment', {
          ...addAppointmentDto,
          mindBodyAuthorization: user.mindBodyToken,
          ClientId: user.mindBodyClientId,
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
  async getSingleAppointmentWellness(
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
        this.appoitmentServiceClient.send('update_mindbody_appointment', {
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

  @Get('class')
  async getAppointmentClass(
    @GetUserRequest() user: IUser,
  ): Promise<getAppointmentClassResponseDto> {
    const getClassesAppointmentResponse: IGetClassesResponse =
      await firstValueFrom(
        this.classServiceClient.send('get_classes', {
          clientId: user.mindBodyClientId,
          mindBodyAuthorization: user.mindBodyToken,
        }),
      );

    if (getClassesAppointmentResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getClassesAppointmentResponse.message,
        },
        getClassesAppointmentResponse.status,
      );
    }

    return {
      message: 'Appointment Classes',
      data: {
        classes: getClassesAppointmentResponse.data.Classes,
        paginationResponse:
          getClassesAppointmentResponse.data.PaginationResponse,
      },
    };
  }

  @Post('class')
  async addAppointmentClass(
    @Body() addClientToClassDto: AddClientToClassDto,
    @GetUserRequest() user: IUser,
  ): Promise<AddClientToClassResponseDto> {
    const addClientToClassResponse: IAddClientToClassResponse =
      await firstValueFrom(
        this.classServiceClient.send('add_client_to_class', {
          ...addClientToClassDto,
          clientId: user.mindBodyClientId,
          mindBodyAuthorization: user.mindBodyToken,
        }),
      );

    if (addClientToClassResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: addClientToClassResponse.message,
        },
        addClientToClassResponse.status,
      );
    }

    return {
      message: 'Appointment Added',
      data: {
        ...addClientToClassResponse.data,
      },
    };
  }

  @Get('class/:classId')
  async getSingleAppointmentClass(
    @Param('classId') classId: number,
    @GetUserRequest() user: IUser,
  ): Promise<IClass> {
    const getClassReponse: IGetClassesResponse = await firstValueFrom(
      this.classServiceClient.send('get_classes', {
        clientId: user.mindBodyClientId,
        mindBodyAuthorization: user.mindBodyToken,
        classIds: classId,
      }),
    );

    if (getClassReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getClassReponse.message,
        },
        getClassReponse.status,
      );
    }

    return {
      ...getClassReponse.data.Classes[0],
    };
  }
}
