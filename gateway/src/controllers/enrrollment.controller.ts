import {
  Controller,
  UseGuards,
  Inject,
  Get,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { getRequestHeaderParam } from '../decorators/getRequestHeaderParam.decorator';
import { AuthGuard } from '../guards/auth.guard';
import {
  GetEnrrollmentsDto,
  GetEnrrollmentsResponseDto,
  IGetEnrrollmentResponse,
} from '../interfaces/enrrollment';
import { AppService } from '../services/app.service';

@UseGuards(AuthGuard)
@Controller('enrrollment')
export class EnrrollmentController {
  constructor(
    private readonly appService: AppService,
    @Inject('ENRROLLMENT_SERVICE')
    private readonly enrrollmentServiceClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello('appointment');
  }

  @Get('enrollments')
  async getEnrrollmnets(
    @Query() queryParams: GetEnrrollmentsDto,
    @getRequestHeaderParam('mindbodyauthorization') param: string,
  ): Promise<GetEnrrollmentsResponseDto> {
    const getEnrrollmentsResponse: IGetEnrrollmentResponse =
      await firstValueFrom(
        this.enrrollmentServiceClient.send('get_enrrollments', {
          ...queryParams,
          mindbodyauthorization: param,
        }),
      );

    if (getEnrrollmentsResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getEnrrollmentsResponse.message,
          data: null,
          errors: getEnrrollmentsResponse.errors,
        },
        getEnrrollmentsResponse.status,
      );
    }

    return {
      message: getEnrrollmentsResponse.message,
      data: getEnrrollmentsResponse.data,
      errors: null,
    };
  }
}
