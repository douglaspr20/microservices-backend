import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import {
  AddAppointmentCerboResponseDto,
  AddAppointmentDto,
  AddAppointmentResponseDto,
  AddCerboAppointmentDto,
  DeleteCerboAppointmentDto,
  DeleteCerboAppointmentResponseDto,
  GetCerboAppointmentsDto,
  GetCerboAppointmentsResponseDto,
  GetCerboAppointmentsTypesDto,
  GetCerboAppointmentsTypesResponseDto,
  GetSingleAppointmentDto,
  GetSingleCerboAppointmentResponseDto,
  IAppointmentCerbo,
  IDeleteAppointmentCerboResponse,
  IGetAppointmentResponseCerbo,
  IGetAppointmentTypeResponseCerbo,
  UpdateCerboAppointmentResponseDto,
  UpdateCerboAppointmentDto,
  GetMindBodyAppointmentsDto,
  GetMindBodyAppointmentsResponseDto,
  UpdateMindBodyAppointmentDto,
  UpdateMindBodyAppointmentResponseDto,
} from './interfaces';
import { CerboErrorResponse, MindBodyErrorResponse } from './types';
import { ConfigService } from './services/config.service';

@Controller()
export class AppointmentController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  mindbodyUrl = this.configService.get('mindbodyBaseUrl');
  cerboUrl = this.configService.get('cerboBaseUrl');
  cerboUsername = this.configService.get('cerboUsername');
  cerboSecretKey = this.configService.get('cerboSecretKey');

  @MessagePattern('get_cerbo_appointments_range_date')
  async getCerboAppointmentsInDateRange(
    @Payload() getCerboAppointmentsDto: GetCerboAppointmentsDto,
  ): Promise<GetCerboAppointmentsResponseDto> {
    this.httpService.axiosRef.defaults.auth = {
      username: this.cerboUsername,
      password: this.cerboSecretKey,
    };

    this.httpService.axiosRef.defaults.params = {
      ...getCerboAppointmentsDto,
    };

    try {
      const { data } =
        await this.httpService.axiosRef.get<IGetAppointmentResponseCerbo>(
          `${this.cerboUrl}/appointments`,
        );

      const { data: appointments, has_more, total_count } = data;

      return {
        status: HttpStatus.OK,
        message: 'Appointments founds',
        data: {
          total_count,
          has_more,
          appointments,
        },
        errors: null,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
          data: null,
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

  @MessagePattern('get_cerbo_single_appointment')
  async getCerboAppointment(
    @Payload() getSingleAppointmentDto: GetSingleAppointmentDto,
  ): Promise<GetSingleCerboAppointmentResponseDto> {
    const { appointmentId } = getSingleAppointmentDto;
    this.httpService.axiosRef.defaults.auth = {
      username: this.cerboUsername,
      password: this.cerboSecretKey,
    };

    try {
      const { data } = await this.httpService.axiosRef.get<IAppointmentCerbo>(
        `${this.cerboUrl}/appointments/${appointmentId}`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Appointment found',
        data,
        errors: null,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
          data: null,
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

  @MessagePattern('add_cerbo_appointment')
  async AddCerboAppointment(
    @Payload() addCerboAppointmentDto: AddCerboAppointmentDto,
  ): Promise<AddAppointmentCerboResponseDto> {
    this.httpService.axiosRef.defaults.auth = {
      username: this.cerboUsername,
      password: this.cerboSecretKey,
    };

    try {
      const { data } = await this.httpService.axiosRef.post<IAppointmentCerbo>(
        `${this.cerboUrl}/appointments`,
        {
          ...addCerboAppointmentDto,
        },
      );

      return {
        status: HttpStatus.OK,
        message: 'Appointment Created Successfully',
        data,
        errors: null,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
          data: null,
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

  @MessagePattern('update_cerbo_appointment')
  async updateCerboAppointment(
    @Payload() updateCerboAppointmentDto: UpdateCerboAppointmentDto,
  ): Promise<UpdateCerboAppointmentResponseDto> {
    const { appointmentId, ...rest } = updateCerboAppointmentDto;
    this.httpService.axiosRef.defaults.auth = {
      username: this.cerboUsername,
      password: this.cerboSecretKey,
    };

    try {
      const { data } = await this.httpService.axiosRef.patch<IAppointmentCerbo>(
        `${this.cerboUrl}/appointments/${appointmentId}`,
        {
          ...rest,
        },
      );

      return {
        status: HttpStatus.OK,
        message: 'Appointment updated Successfully',
        data,
        errors: null,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
          data: null,
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

  @MessagePattern('delete_cerbo_appointment')
  async deleteCerboAppointment(
    @Payload() deleteCerboAppointmentDto: DeleteCerboAppointmentDto,
  ): Promise<DeleteCerboAppointmentResponseDto> {
    const { appointmentId } = deleteCerboAppointmentDto;
    this.httpService.axiosRef.defaults.auth = {
      username: this.cerboUsername,
      password: this.cerboSecretKey,
    };

    try {
      await this.httpService.axiosRef.delete<IDeleteAppointmentCerboResponse>(
        `${this.cerboUrl}/appointments/${appointmentId}`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Appointment Successfully Deleted',
        errors: null,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
          errors: e.errors,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        errors: e.errors,
      };
    }
  }

  @MessagePattern('get_cerbo_appointments_types')
  async getCerboAppointmentsTypes(
    @Payload() getCerboAppointmentsTypesDto: GetCerboAppointmentsTypesDto,
  ): Promise<GetCerboAppointmentsTypesResponseDto> {
    this.httpService.axiosRef.defaults.auth = {
      username: this.cerboUsername,
      password: this.cerboSecretKey,
    };

    this.httpService.axiosRef.defaults.params = {
      ...getCerboAppointmentsTypesDto,
    };

    try {
      const { data } =
        await this.httpService.axiosRef.get<IGetAppointmentTypeResponseCerbo>(
          `${this.cerboUrl}/appointment_types`,
        );

      const { data: appointmentTypes, has_more, total_count } = data;

      return {
        status: HttpStatus.OK,
        message: 'Appointment types founds',
        data: {
          total_count,
          has_more,
          appointmentTypes,
        },
        errors: null,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
          data: null,
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

  @MessagePattern('get_mindboy_appointments')
  async getMindBodyAppointments(
    @Payload() getMindBodyAppointmentsDto: GetMindBodyAppointmentsDto,
  ): Promise<GetMindBodyAppointmentsResponseDto> {
    const { mindBodyAuthorization, clientId } = getMindBodyAppointmentsDto;

    if (!getMindBodyAppointmentsDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing or bad data for request',
      };
    }

    if (!mindBodyAuthorization || mindBodyAuthorization === '' || !clientId) {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'forbidden resource',
      };
    }

    this.httpService.axiosRef.defaults.params = {
      ...getMindBodyAppointmentsDto,
    };

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      mindBodyAuthorization;

    try {
      const response = await this.httpService.axiosRef.get(
        `${this.mindbodyUrl}/appointment/staffappointments`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Appointments found',
        data: response.data,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      const { Error } = response.data as MindBodyErrorResponse;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          data: null,
          message: Error.Message,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        data: null,
      };
    }
  }

  @MessagePattern('add_mindbody_appointment')
  async addMindBodyAppointment(
    @Payload() addAppointmentDto: AddAppointmentDto,
  ): Promise<AddAppointmentResponseDto> {
    const { mindBodyAuthorization } = addAppointmentDto;

    if (!addAppointmentDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for add appointment',
        data: null,
        errors: null,
      };
    }

    if (!mindBodyAuthorization || mindBodyAuthorization === '') {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'forbidden resource',
        data: null,
        errors: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      mindBodyAuthorization;

    try {
      const response = await this.httpService.axiosRef.post(
        `${this.mindbodyUrl}/addappointment`,
        addAppointmentDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Appointment Added',
        data: response.data,
        errors: null,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      const { Error } = response.data as MindBodyErrorResponse;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          data: null,
          message: Error.Message,
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

  @MessagePattern('get_single_mindboy_appointment')
  async getSingleMindBodyAppointment(
    @Payload() getSingleAppointmentDto: GetSingleAppointmentDto,
  ): Promise<GetMindBodyAppointmentsResponseDto> {
    const { mindBodyAuthorization, appointmentId } = getSingleAppointmentDto;

    if (!getSingleAppointmentDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing or bad data for request',
      };
    }

    if (
      !mindBodyAuthorization ||
      mindBodyAuthorization === '' ||
      !appointmentId
    ) {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'forbidden resource',
      };
    }

    this.httpService.axiosRef.defaults.params = {
      appointmentIds: appointmentId,
    };

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      mindBodyAuthorization;

    try {
      const response = await this.httpService.axiosRef.get(
        `${this.mindbodyUrl}/appointment/staffappointments`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Appointment found',
        data: response.data.Appointments[0],
      };
    } catch (e) {
      const { response } = e as AxiosError;

      const { Error } = response.data as MindBodyErrorResponse;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          data: null,
          message: Error.Message,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        data: null,
      };
    }
  }

  @MessagePattern('update_mindbody_appointment')
  async updateMindBodyAppointment(
    @Payload() updateMindBodyAppointmentDto: UpdateMindBodyAppointmentDto,
  ): Promise<UpdateMindBodyAppointmentResponseDto> {
    const { mindBodyAuthorization, appointmentId } =
      updateMindBodyAppointmentDto;

    if (!updateMindBodyAppointmentDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing or bad data for request',
        data: null,
      };
    }

    if (
      !mindBodyAuthorization ||
      mindBodyAuthorization === '' ||
      !appointmentId
    ) {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'forbidden resource',
        data: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      mindBodyAuthorization;

    try {
      const response = await this.httpService.axiosRef.post(
        `${this.mindbodyUrl}/appointment/updateappointment`,
        {
          AppointmentId: appointmentId,
          ...updateMindBodyAppointmentDto,
        },
      );

      return {
        status: HttpStatus.OK,
        message: 'Appointment Updated',
        data: response.data.Appointments[0],
      };
    } catch (e) {
      const { response } = e as AxiosError;

      const { Error } = response.data as MindBodyErrorResponse;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          data: null,
          message: Error.Message,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        data: null,
      };
    }
  }
}
