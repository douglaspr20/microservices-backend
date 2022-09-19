import {
  Controller,
  Inject,
  Get,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('patients')
export class PatientController {
  constructor(
    @Inject('PATIENT_SERVICE')
    private readonly patientServiceClient: ClientProxy,
  ) {}

  @Get()
  async getPatients(): Promise<any> {
    const getPatientsReponse = await firstValueFrom(
      this.patientServiceClient.send('get_patients', {}),
    );

    if (getPatientsReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getPatientsReponse.message,
          data: null,
          errors: getPatientsReponse.errors,
        },
        getPatientsReponse.status,
      );
    }

    return {
      message: getPatientsReponse.message,
      data: getPatientsReponse.data,
      errors: null,
    };
  }
}
