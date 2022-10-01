import { HttpService } from '@nestjs/axios';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import {
  AddPatientDto,
  AddPatientResponseDto,
  DeletePatientDto,
  DeletePatientResponseDto,
  GetAllDocumentsDto,
  GetPatientDataResponseDto,
  GetPatientsDto,
  GetPatientsResponseDto,
  GetSinglePatientDto,
  GetSinglePatientResponseDto,
  IGetDocumentsPatient,
  IGetPatientsResponseCerbo,
  IGetRxes,
  IGetVaccinesPatient,
  IGetVitalsPatient,
  IPatient,
  SearchPatientDto,
  UpdatePatientDto,
  UpdatePatientResponseDto,
} from './interfaces';
import { CerboErrorResponse } from './types';

@Controller()
export class PatientController {
  constructor(private readonly httpService: HttpService) {}

  @MessagePattern('get_patients')
  async getPatients(
    @Payload() getPatientsDto: GetPatientsDto,
  ): Promise<GetPatientsResponseDto> {
    this.httpService.axiosRef.defaults.params = {
      ...getPatientsDto,
    };

    try {
      const { data } =
        await this.httpService.axiosRef.get<IGetPatientsResponseCerbo>(
          '/patients',
        );

      const { total_count, has_more, data: patients } = data;

      return {
        status: HttpStatus.OK,
        message: 'Patients Found',
        data: {
          total_count,
          has_more,
          patients,
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
          data: null,
          message: error ? error.message : message,
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

  @MessagePattern('search_patient')
  async searchPatient(
    @Payload() searchPatientDto: SearchPatientDto,
  ): Promise<GetPatientsResponseDto> {
    this.httpService.axiosRef.defaults.params = {
      ...searchPatientDto,
    };

    try {
      const { data } =
        await this.httpService.axiosRef.get<IGetPatientsResponseCerbo>(
          '/patients/search',
        );

      const { total_count, has_more, data: patients } = data;

      return {
        status: HttpStatus.OK,
        message: 'Patients Found',
        data: {
          total_count,
          has_more,
          patients,
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
          data: null,
          message: error ? error.message : message,
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

  @MessagePattern('get_single_patient')
  async getSinglePatient(
    @Payload() getSinglePatientDto: GetSinglePatientDto,
  ): Promise<GetSinglePatientResponseDto> {
    const { patientId } = getSinglePatientDto;
    try {
      const { data } = await this.httpService.axiosRef.get(
        `/patients/${patientId}`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Patients Found',
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
          data: null,
          message: error ? error.message : message,
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

  @MessagePattern('add_patient')
  async addPatient(
    @Payload() addPatientDto: AddPatientDto,
  ): Promise<AddPatientResponseDto> {
    try {
      const { data } = await this.httpService.axiosRef.post<IPatient>(
        `/patients`,
        {
          ...addPatientDto,
        },
      );

      return {
        status: HttpStatus.OK,
        message: 'Patients Added Successfully',
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
          data: null,
          message: error ? error.message : message,
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

  @MessagePattern('update_patient')
  async updatePatient(
    @Payload() updatePatientDto: UpdatePatientDto,
  ): Promise<UpdatePatientResponseDto> {
    const { patientId } = updatePatientDto;
    try {
      const { data } = await this.httpService.axiosRef.patch<IPatient>(
        `/patients/${patientId}`,
        {
          ...updatePatientDto,
        },
      );

      return {
        status: HttpStatus.OK,
        message: 'Patients Updated Successfully',
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
          data: null,
          message: error ? error.message : message,
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

  @MessagePattern('delete_patient')
  async deletePatient(
    @Payload() deletePatientDto: DeletePatientDto,
  ): Promise<DeletePatientResponseDto> {
    const { patientId } = deletePatientDto;
    try {
      const response = await this.httpService.axiosRef.delete(
        `/patients/${patientId}`,
      );

      if (response.status === HttpStatus.OK) {
        return {
          status: HttpStatus.OK,
          message: 'Patients Deleted',
          errors: null,
        };
      }
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

  @MessagePattern('patient_documents')
  async getAllDocumentsRecordsPatient(
    @Payload() getAllDocumentsDto: GetAllDocumentsDto,
  ): Promise<GetPatientDataResponseDto> {
    const { patientId } = getAllDocumentsDto;
    try {
      const { data } =
        await this.httpService.axiosRef.get<IGetDocumentsPatient>(
          `/patients/${patientId}/documents`,
        );

      return {
        status: HttpStatus.OK,
        message: 'Document founds',
        ...data,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('patient_rxes')
  async getAllRxesRecords(
    @Payload() patientId: string,
  ): Promise<GetPatientDataResponseDto> {
    try {
      const { data } = await this.httpService.axiosRef.get<IGetRxes>(
        `/patients/${patientId}/rxs`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Prescriptions founds',
        ...data,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('patient_vaccines')
  async getAllVaccineRecordsPatient(
    @Payload() patientId: string,
  ): Promise<GetPatientDataResponseDto> {
    try {
      const { data } = await this.httpService.axiosRef.get<IGetVaccinesPatient>(
        `/patients/${patientId}/vaccines`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Vaccines founds',
        ...data,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('patient_vitals_height')
  async getAllVitalHeightRecordsPatient(
    @Payload() patientId: string,
  ): Promise<GetPatientDataResponseDto> {
    try {
      const { data } = await this.httpService.axiosRef.get<IGetVitalsPatient>(
        `/patients/${patientId}/vitals/height`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Patient Heights',
        ...data,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('patient_vitals_weight')
  async getAllVitalWeightRecordsPatient(
    @Payload() patientId: string,
  ): Promise<GetPatientDataResponseDto> {
    try {
      const { data } = await this.httpService.axiosRef.get<IGetVitalsPatient>(
        `/patients/${patientId}/vitals/weight`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Patient Weights',
        ...data,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }

  @MessagePattern('patient_vitals_bp')
  async getAllVitalBpRecordsPatient(
    @Payload() patientId: string,
  ): Promise<GetPatientDataResponseDto> {
    try {
      const { data } = await this.httpService.axiosRef.get<IGetVitalsPatient>(
        `/patients/${patientId}/vitals/bp`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Patient Blood Pressure',
        ...data,
      };
    } catch (e) {
      const { response } = e as AxiosError;

      console.log(response);

      const { error, message } = response.data as CerboErrorResponse;

      if (response.status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          status: response.status,
          message: error ? error.message : message,
        };
      }

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      };
    }
  }
}
