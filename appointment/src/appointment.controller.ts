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
  GetSingleCerboAppointmentDto,
  GetSingleCerboAppointmentResponseDto,
  IAppointmentCerbo,
  IDeleteAppointmentCerboResponse,
  IGetAppointmentResponseCerbo,
  IGetAppointmentTypeResponseCerbo,
  UpdateCerboAppointmentResponseDto,
  UpdateCerboAppointmentDto,
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
    @Payload() getSingleCerboAppointmentDto: GetSingleCerboAppointmentDto,
  ): Promise<GetSingleCerboAppointmentResponseDto> {
    const { appointment_id } = getSingleCerboAppointmentDto;
    this.httpService.axiosRef.defaults.auth = {
      username: this.cerboUsername,
      password: this.cerboSecretKey,
    };

    try {
      const { data } = await this.httpService.axiosRef.get<IAppointmentCerbo>(
        `${this.cerboUrl}/appointments/${appointment_id}`,
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
    const { appointment_id, ...rest } = updateCerboAppointmentDto;
    this.httpService.axiosRef.defaults.auth = {
      username: this.cerboUsername,
      password: this.cerboSecretKey,
    };

    try {
      const { data } = await this.httpService.axiosRef.patch<IAppointmentCerbo>(
        `${this.cerboUrl}/appointments/${appointment_id}`,
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
    const { appointment_id } = deleteCerboAppointmentDto;
    this.httpService.axiosRef.defaults.auth = {
      username: this.cerboUsername,
      password: this.cerboSecretKey,
    };

    try {
      await this.httpService.axiosRef.delete<IDeleteAppointmentCerboResponse>(
        `${this.cerboUrl}/appointments/${appointment_id}`,
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
}
