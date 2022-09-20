import {
  Controller,
  Inject,
  Get,
  HttpStatus,
  HttpException,
  UseGuards,
  Query,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AddPatientDto,
  AddPatientResponseDto,
  DeletePatientResponseDto,
  GetPatientsDto,
  GetPatientsResponseDto,
  GetSinglePatientResponseDto,
  IAddPatientResponse,
  IDeletePatientResponse,
  IGetPatientsResponse,
  IGetSinglePatientResponse,
  UpdatePatientDto,
  UpdatePatientResponseDto,
} from '../interfaces/patient';
import { AuthGuard } from '../guards';

@UseGuards(AuthGuard)
@Controller('patients')
export class PatientController {
  constructor(
    @Inject('PATIENT_SERVICE')
    private readonly patientServiceClient: ClientProxy,
  ) {}

  @Get()
  async getPatients(
    @Query() queryParams: GetPatientsDto,
  ): Promise<GetPatientsResponseDto> {
    const getPatientsReponse: IGetPatientsResponse = await firstValueFrom(
      this.patientServiceClient.send('get_patients', { ...queryParams }),
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

  @Get(':patientId')
  async getSinglePatient(
    @Param('patientId') patientId: number,
  ): Promise<GetSinglePatientResponseDto> {
    const getSinglePatientReponse: IGetSinglePatientResponse =
      await firstValueFrom(
        this.patientServiceClient.send('get_single_patient', { patientId }),
      );

    if (getSinglePatientReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getSinglePatientReponse.message,
          data: null,
          errors: getSinglePatientReponse.errors,
        },
        getSinglePatientReponse.status,
      );
    }

    return {
      message: getSinglePatientReponse.message,
      data: getSinglePatientReponse.data,
      errors: null,
    };
  }

  @Post()
  async addPatient(
    @Body() addPatientDto: AddPatientDto,
  ): Promise<AddPatientResponseDto> {
    const addPatientResponse: IAddPatientResponse = await firstValueFrom(
      this.patientServiceClient.send('add_patient', { ...addPatientDto }),
    );

    if (addPatientResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: addPatientResponse.message,
          data: null,
          errors: addPatientResponse.errors,
        },
        addPatientResponse.status,
      );
    }

    return {
      message: addPatientResponse.message,
      data: addPatientResponse.data,
      errors: null,
    };
  }

  @Patch(':patientId')
  async updatePatient(
    @Param('patientId') patientId: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<UpdatePatientResponseDto> {
    const updatePatientResponse: IAddPatientResponse = await firstValueFrom(
      this.patientServiceClient.send('update_patient', {
        ...updatePatientDto,
        patientId,
      }),
    );

    if (updatePatientResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: updatePatientResponse.message,
          data: null,
          errors: updatePatientResponse.errors,
        },
        updatePatientResponse.status,
      );
    }

    return {
      message: updatePatientResponse.message,
      data: updatePatientResponse.data,
      errors: null,
    };
  }

  @Delete(':patientId')
  async deletePatient(
    @Param('patientId') patientId: number,
  ): Promise<DeletePatientResponseDto> {
    const deletePatientReponse: IDeletePatientResponse = await firstValueFrom(
      this.patientServiceClient.send('delete_patient', { patientId }),
    );

    if (deletePatientReponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: deletePatientReponse.message,
          errors: deletePatientReponse.errors,
        },
        deletePatientReponse.status,
      );
    }

    return {
      message: deletePatientReponse.message,
      errors: null,
    };
  }
}
