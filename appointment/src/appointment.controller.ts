import { Body, Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { AddAppointmentDto, AddAppointmentResponseDto } from './interfaces';

@Controller()
export class AppointmentController {
  constructor(private readonly httpService: HttpService) {}

  @MessagePattern('add_appointment')
  async addClientToClass(
    @Body() addAppointmentDto: AddAppointmentDto,
  ): Promise<AddAppointmentResponseDto> {
    const { mindbodyauthorization } = addAppointmentDto;

    if (!addAppointmentDto) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing data for add appointment',
        data: null,
        errors: null,
      };
    }

    if (!mindbodyauthorization || mindbodyauthorization === '') {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
        data: null,
        errors: null,
      };
    }

    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      mindbodyauthorization;

    try {
      const response = await this.httpService.axiosRef.post(
        `/addappointment`,
        addAppointmentDto,
      );

      return {
        status: HttpStatus.OK,
        message: 'Appointment Added',
        data: response.data,
        errors: null,
      };
    } catch (e) {
      const { response, message } = e as AxiosError;

      console.log(response);

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          data: null,
          message: message,
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
