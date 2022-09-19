import { HttpService } from '@nestjs/axios';
import { Body, Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AxiosError } from 'axios';

@Controller()
export class PatientController {
  constructor(private readonly httpService: HttpService) {}

  @MessagePattern('get_patients')
  async getPatients() {
    try {
    } catch (e) {}
  }
}
