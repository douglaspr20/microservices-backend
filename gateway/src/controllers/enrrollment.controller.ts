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
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';
import { GetRequestHeaderParam } from '../decorators/getRequestHeaderParam.decorator';
import {
  GetEnrrollmentsDto,
  GetEnrrollmentsResponseDto,
  IGetEnrrollmentResponse,
} from '../interfaces/enrrollment';
import { AppService } from '../services/app.service';

@UseGuards(AuthGuard('jwt'))
@Controller('enrrollments')
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

  @Get()
  async getEnrrollmnets(
    @Query() queryParams: GetEnrrollmentsDto,
    @GetRequestHeaderParam('mindbodyauthorization') param: string,
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
