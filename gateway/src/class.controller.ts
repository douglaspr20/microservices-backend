import {
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { getRequestHeaderParam } from './decorators/getRequestHeaderParam.decorator';
import { AuthGuard } from './guards/auth.guard';
import {
  getClassDescriptionDto,
  GetClassDescriptionResponseDto,
  GetClassesResponseDto,
  IGetClassDescriptionResponse,
  IGetClassesResponse,
} from './interfaces/class';
import { AppService } from './services/app.service';

@UseGuards(AuthGuard)
@Controller('class')
export class ClassController {
  constructor(
    private readonly appService: AppService,
    @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello('class');
  }

  @Get('classes')
  async getClasses(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @getRequestHeaderParam('authorization') param: string,
  ): Promise<GetClassesResponseDto> {
    const getClassesResponse: IGetClassesResponse = await firstValueFrom(
      this.classServiceClient.send('get_classes', {
        limit,
        offset,
        authorization: param,
      }),
    );

    if (getClassesResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getClassesResponse.message,
          data: null,
          errors: getClassesResponse.errors,
        },
        getClassesResponse.status,
      );
    }

    return {
      message: getClassesResponse.message,
      data: getClassesResponse.data,
      errors: null,
    };
  }

  @Get('classDescriptions')
  async getClassDescriptions(
    @Query() queryParams: getClassDescriptionDto,
    @getRequestHeaderParam('authorization') param: string,
  ): Promise<GetClassDescriptionResponseDto> {
    const getClassDescriptionsResponse: IGetClassDescriptionResponse =
      await firstValueFrom(
        this.classServiceClient.send('class_descriptions', {
          ...queryParams,
          authorization: param,
        }),
      );

    if (getClassDescriptionsResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getClassDescriptionsResponse.message,
          data: null,
          errors: getClassDescriptionsResponse.errors,
        },
        getClassDescriptionsResponse.status,
      );
    }

    return {
      message: getClassDescriptionsResponse.message,
      data: getClassDescriptionsResponse.data,
      errors: null,
    };
  }
}
