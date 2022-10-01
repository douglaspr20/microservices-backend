import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';
import {
  IPatientBloodPressure,
  IPatientDocument,
  IPatientHeightOrWeight,
  IPatientRx,
  IPatientVaccine,
} from 'src/interfaces/patient';
import { GetUserRequest } from '../decorators';
import {
  GetAllDocumentsDto,
  GetBpResponseDto,
  GetHeightsResponseDto,
  GetPatientDocumentsResponseDto,
  GetRxesResponseDto,
  GetVaccinesResponseDto,
  GetWeightsResponseDto,
  IGetPatientDataResponse,
} from '../interfaces/record';
import { IUser } from '../interfaces/user';

@Controller('record')
@UseGuards(AuthGuard('jwt'))
export class RecordController {
  constructor(
    @Inject('PATIENT_SERVICE')
    private readonly patientServiceClient: ClientProxy,
  ) {}

  @Get('document')
  async getAllDocumentsRecordsPatient(
    @Query() getAllDocumentsDto: GetAllDocumentsDto,
    @GetUserRequest() user: IUser,
  ): Promise<GetPatientDocumentsResponseDto> {
    const getDocumentsPatientResponse: IGetPatientDataResponse =
      await firstValueFrom(
        this.patientServiceClient.send('patient_documents', {
          ...getAllDocumentsDto,
          patientId: user.cerboPatientId,
        }),
      );

    if (getDocumentsPatientResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getDocumentsPatientResponse.message,
        },
        getDocumentsPatientResponse.status,
      );
    }

    const documents = getDocumentsPatientResponse.data as IPatientDocument[];

    return {
      documents: documents.map((document) => ({
        id: document.id,
        portalAllowed: document.pt_portal_allowed,
        portalAllowedDate: document.pt_portal_allowed_date,
        folder: document.folder,
        subfolder: document.subfolder,
        urlDocument: document.url_document_content,
      })),
    };
  }

  @Get('rx')
  async getAllRxesRecords(
    @GetUserRequest() user: IUser,
  ): Promise<GetRxesResponseDto> {
    const getRxesPatientResponse: IGetPatientDataResponse =
      await firstValueFrom(
        this.patientServiceClient.send('patient_rxes', user.cerboPatientId),
      );

    if (getRxesPatientResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getRxesPatientResponse.message,
        },
        getRxesPatientResponse.status,
      );
    }

    const rxes = getRxesPatientResponse.data as IPatientRx[];

    return {
      rxes: rxes.map((rx) => ({
        id: rx.id,
        name: rx.name,
        strength: rx.strength,
        frequency: rx.frequency,
        doses: rx.doses_rxed,
        refills: rx.refills_rxed,
        isDiscontinued: rx.is_discontinued,
        dateDiscontinued: rx.date_discontinued,
        isExpired: rx.is_expired,
        dateExpired: rx.date_expired,
        created: rx.created,
        drugDetails: {
          id: rx.drug_details.id,
          name: rx.drug_details.name,
          productName: rx.drug_details.product_name,
          doseForm: rx.drug_details.dose_form,
        },
      })),
    };
  }

  @Get('vaccine')
  async getAllVaccineRecordsPatient(
    @GetUserRequest() user: IUser,
  ): Promise<GetVaccinesResponseDto> {
    const getVaccinesPatientResponse: IGetPatientDataResponse =
      await firstValueFrom(
        this.patientServiceClient.send('patient_vaccines', user.cerboPatientId),
      );

    if (getVaccinesPatientResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getVaccinesPatientResponse.message,
        },
        getVaccinesPatientResponse.status,
      );
    }

    const vaccines = getVaccinesPatientResponse.data as IPatientVaccine[];

    return {
      vaccines: vaccines.map((vaccine) => ({
        id: vaccine.id,
        vaccineName: vaccine.vaccine_name,
        dose: vaccine.dose,
        site: vaccine.site,
        dateAdministered: vaccine.administered,
      })),
    };
  }

  @Get('vital/height')
  async getAllVitalHeightRecordsPatient(
    @GetUserRequest() user: IUser,
  ): Promise<GetHeightsResponseDto> {
    const getVitalHeightResponse: IGetPatientDataResponse =
      await firstValueFrom(
        this.patientServiceClient.send(
          'patient_vitals_height',
          user.cerboPatientId,
        ),
      );

    if (getVitalHeightResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getVitalHeightResponse.message,
        },
        getVitalHeightResponse.status,
      );
    }

    const heights = getVitalHeightResponse.data as IPatientHeightOrWeight[];

    return {
      heights: heights.map((height) => ({
        id: height.id,
        dateTaken: height.date_taken,
        height: height.height,
        units: height.units,
      })),
    };
  }

  @Get('vital/weight')
  async getAllVitalWeightRecordsPatient(
    @GetUserRequest() user: IUser,
  ): Promise<GetWeightsResponseDto> {
    const getVitalWeightResponse: IGetPatientDataResponse =
      await firstValueFrom(
        this.patientServiceClient.send(
          'patient_vitals_weight',
          user.cerboPatientId,
        ),
      );

    if (getVitalWeightResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getVitalWeightResponse.message,
        },
        getVitalWeightResponse.status,
      );
    }

    const weights = getVitalWeightResponse.data as IPatientHeightOrWeight[];

    return {
      weights: weights.map((weight) => ({
        id: weight.id,
        dateTaken: weight.date_taken,
        weight: weight.weight,
        units: weight.units,
      })),
    };
  }

  @Get('vital/bp')
  async getAllVitalBpRecordsPatient(
    @GetUserRequest() user: IUser,
  ): Promise<GetBpResponseDto> {
    const getVitalBpResponse: IGetPatientDataResponse = await firstValueFrom(
      this.patientServiceClient.send('patient_vitals_bp', user.cerboPatientId),
    );

    if (getVitalBpResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getVitalBpResponse.message,
        },
        getVitalBpResponse.status,
      );
    }

    const bps = getVitalBpResponse.data as IPatientBloodPressure[];

    return {
      bp: bps.map((bp) => ({
        id: bp.id,
        dateTaken: bp.date_taken,
        systolic: bp.systolic,
        diastolic: bp.diastolic,
        pulse: bp.pulse,
      })),
    };
  }
}
