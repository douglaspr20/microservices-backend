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
  AddAppointmentDto,
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
  UpdateMindBodyAppointmentDto,
  IUpdateMindBodyAppointmentResponse,
  UpdateMindBodyAppointmentResponseDto,
  getAppointmentClassResponseDto,
  IAppointCerboResponse,
  ICerboProviderResponse,
  IGetCerboProviderResponse,
  IAppointmentMindBody,
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
  dateFunctions,
  formatHealthAppointment,
  formatHealthAppointmentArray,
} from '../utils';

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

    const yearEndDate = endDate.getFullYear() + 1;
    const monthEndDate = endDate.getMonth() + 3;
    const dateEndDate = endDate.getDate();

    const formatStartDate = `${yearStartDate}-${
      monthStartDate <= 9 ? `0${monthStartDate}` : monthStartDate
    }-${dateStarDate}`;

    const formatEndDate = `${yearEndDate}-${
      monthEndDate <= 9 ? `0${monthEndDate}` : monthEndDate
    }-${dateEndDate}`;

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
          start_date: formatStartDate,
          end_date: formatEndDate,
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
    let start_date = queryParams.start_date;
    let end_date = queryParams.end_date;

    if (!start_date) {
      const startDate = new Date(user.createdAt);

      const yearStartDate = startDate.getFullYear();
      const monthStartDate = startDate.getMonth() + 1;
      const dateStarDate = startDate.getDate();

      start_date = `${yearStartDate}-${
        monthStartDate <= 9 ? `0${monthStartDate}` : monthStartDate
      }-${dateStarDate}`;
    }

    if (!end_date) {
      const endDate = new Date();

      const yearEndDate = endDate.getFullYear() + 1;
      const monthEndDate = endDate.getMonth() + 3;
      const dateEndDate = endDate.getDate();

      end_date = `${yearEndDate}-${
        monthEndDate <= 9 ? `0${monthEndDate}` : monthEndDate
      }-${dateEndDate}`;
    }

    const getCerboAppointmentResponse: IGetCerboAppointmentsResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('get_cerbo_appointments_range_date', {
          ...queryParams,
          start_date,
          end_date,
          pt_id: user.cerboPatientId,
        }),
      );

    if (getCerboAppointmentResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getCerboAppointmentResponse.message,
        },
        getCerboAppointmentResponse.status,
      );
    }

    return {
      healthAppointments: formatHealthAppointmentArray(
        getCerboAppointmentResponse.data.appointments,
      ),
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
      appointmentTypes:
        getCerboAppointmentTypeResponse.data.appointmentTypes.map((type) => ({
          id: type.id,
          name: type.name,
          description: type.description,
          providers: type.which_providers,
          telemedicine: type.telemedicine,
        })),
    };
  }

  @Get('health/provider/:providerId')
  async getAppointmentHealthProvider(
    @Param('providerId') providerId: number,
  ): Promise<ICerboProviderResponse> {
    const getSingleAppointmetHealthProvider: IGetCerboProviderResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('get_cerbo_provider', providerId),
      );

    if (getSingleAppointmetHealthProvider.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message:
            getSingleAppointmetHealthProvider.message === 'Invalid user ID'
              ? 'Provider Not Found'
              : getSingleAppointmetHealthProvider.message,
        },
        getSingleAppointmetHealthProvider.message === 'Invalid user ID'
          ? 404
          : getSingleAppointmetHealthProvider.status,
      );
    }

    return {
      id: getSingleAppointmetHealthProvider.data.id,
      firstName: getSingleAppointmetHealthProvider.data.first_name,
      middleName: getSingleAppointmetHealthProvider.data.middle_name,
      lastName: getSingleAppointmetHealthProvider.data.last_name,
      active: getSingleAppointmetHealthProvider.data.active,
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
          message:
            getSingleCerboAppointmentResponse.message ===
            'Invalid appointment ID'
              ? 'Appointment not found'
              : getSingleCerboAppointmentResponse.message,
        },
        getSingleCerboAppointmentResponse.message === 'Invalid appointment ID'
          ? 404
          : getSingleCerboAppointmentResponse.status,
      );
    }
    return formatHealthAppointment(getSingleCerboAppointmentResponse.data);
  }

  @Post('health')
  async addAppointmentHealth(
    @Body() addCerboAppointmentDto: AddCerboAppointmentDto,
    @GetUserRequest() user: IUser,
  ): Promise<IAppointCerboResponse> {
    if (
      dateFunctions.isAfter(
        new Date(),
        new Date(addCerboAppointmentDto.startDateTime),
      ) ||
      dateFunctions.isAfter(
        new Date(),
        new Date(addCerboAppointmentDto.endDateTime),
      )
    ) {
      throw new HttpException(
        {
          message:
            'the start and end date of the appointment has to be after the current date',
        },
        400,
      );
    }

    const addedAppoimentCerboResponse: IAddedCerboAppointment =
      await firstValueFrom(
        this.appoitmentServiceClient.send('add_cerbo_appointment', {
          title: addCerboAppointmentDto.title,
          status: addCerboAppointmentDto.appointmentStatus,
          provider_ids: addCerboAppointmentDto.providers,
          // telemedicine: addCerboAppointmentDto.telemedicine.isTelemedicine,
          start_date_time: addCerboAppointmentDto.startDateTime,
          end_date_time: addCerboAppointmentDto.endDateTime,
          appointment_type: addCerboAppointmentDto.appointmentType,
          appointment_note: addCerboAppointmentDto.appointmentNote,
          pt_id: Number(user.cerboPatientId),
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

    return formatHealthAppointment(addedAppoimentCerboResponse.data);
  }

  @Put('health/:appointmentId')
  async updateAppointmentHealth(
    @Param('appointmentId') appointmentId: number,
    @Body() updateCerboAppointmentDto: UpdateCerboAppointmentDto,
  ): Promise<IAppointCerboResponse> {
    const updateAppoimentCerboResponse: IUpdateCerboAppointmentResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('update_cerbo_appointment', {
          title: updateCerboAppointmentDto.title,
          status: updateCerboAppointmentDto.appointmentStatus,
          provider_ids: updateCerboAppointmentDto.providers,
          // telemedicine: updateCerboAppointmentDto.telemedicine.isTelemedicine,
          start_date_time: updateCerboAppointmentDto.startDateTime,
          end_date_time: updateCerboAppointmentDto.endDateTime,
          appointment_type: updateCerboAppointmentDto.appointmentType,
          appointment_note: updateCerboAppointmentDto.appointmentNote,
          appointmentId,
        }),
      );

    if (updateAppoimentCerboResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message:
            updateAppoimentCerboResponse.message ===
            'Invalid appointment ID - cannot make edits to an appointment that does not exist'
              ? 'Appointment not found'
              : updateAppoimentCerboResponse.message,
        },
        updateAppoimentCerboResponse.message ===
        'Invalid appointment ID - cannot make edits to an appointment that does not exist'
          ? 404
          : updateAppoimentCerboResponse.status,
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
      wellnessAppointments: getMindBodyAppointmentResponse.data.Appointments,
    };
  }

  @Post('wellness')
  async addAppointmentWellness(
    @Body() addAppointmentDto: AddAppointmentDto,
    @GetUserRequest() user: IUser,
  ): Promise<IAppointmentMindBody> {
    const addAppoimentResponse: IAppointmentAddedResponse =
      await firstValueFrom(
        this.appoitmentServiceClient.send('add_mindbody_appointment', {
          ...addAppointmentDto,
          mindBodyAuthorization: user.mindBodyToken,
          ClientId: user.mindBodyClientId,
        }),
      );

    if (addAppoimentResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: addAppoimentResponse.message,
        },
        addAppoimentResponse.status,
      );
    }

    return {
      ...addAppoimentResponse.data,
    };
  }

  @Get('wellness/:appointmentId')
  async getSingleAppointmentWellness(
    @Param('appointmentId') appointmentId: number,
    @GetUserRequest() user: IUser,
  ): Promise<IAppointmentMindBody> {
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
      ...getSingleMindBodyAppointmentResponse.data,
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
          message: updateMindBodyAppointmentResponse.message.includes(
            'not found',
          )
            ? 'Appointment not found'
            : updateMindBodyAppointmentResponse.message,
        },
        updateMindBodyAppointmentResponse.message.includes('not found')
          ? 404
          : updateMindBodyAppointmentResponse.status,
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
          ClassId: addClientToClassDto.classId,
          Test: addClientToClassDto.test,
          RequirePayment: addClientToClassDto.requirePayment,
          Waitlist: addClientToClassDto.waitlist,
          SendEmail: addClientToClassDto.sendEmail,
          CrossRegionalBooking: addClientToClassDto.crossRegionalBooking,
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

    if (getClassReponse.data.Classes.length === 0) {
      throw new HttpException(
        {
          message: 'Appointment class not found',
        },
        404,
      );
    }

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
