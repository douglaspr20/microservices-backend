import {
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
  Post,
  Body,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetRequestHeaderParam } from '../decorators/getRequestHeaderParam.decorator';
import { AppService } from '../services/app.service';
import { AuthGuard } from '../guards/auth.guard';
import {
  AddClientToClassDto,
  AddClientToClassResponseDto,
  getClassDescriptionDto,
  GetClassDescriptionResponseDto,
  GetClassesResponseDto,
  IGetClassDescriptionResponse,
  IGetClassesResponse,
  IAddClientToClassResponse,
} from '../interfaces/class';

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
    @GetRequestHeaderParam('mindbodyauthorization') param: string,
  ): Promise<GetClassesResponseDto> {
    const getClassesResponse: IGetClassesResponse = await firstValueFrom(
      this.classServiceClient.send('get_classes', {
        limit,
        offset,
        mindbodyauthorization: param,
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
    @GetRequestHeaderParam('mindbodyauthorization') param: string,
  ): Promise<GetClassDescriptionResponseDto> {
    const getClassDescriptionsResponse: IGetClassDescriptionResponse =
      await firstValueFrom(
        this.classServiceClient.send('class_descriptions', {
          ...queryParams,
          mindbodyauthorization: param,
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

  @Post('addClientToClass')
  async addClientToClass(
    @Body() addClientToClassDto: AddClientToClassDto,
    @GetRequestHeaderParam('mindbodyauthorization') param: string,
  ): Promise<AddClientToClassResponseDto> {
    const addClientToClassResponse: IAddClientToClassResponse =
      await firstValueFrom(
        this.classServiceClient.send('add_client_to_class', {
          ...addClientToClassDto,
          mindbodyauthorization: param,
        }),
      );

    if (addClientToClassResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: addClientToClassResponse.message,
          data: null,
          errors: addClientToClassResponse.errors,
        },
        addClientToClassResponse.status,
      );
    }

    return {
      message: addClientToClassResponse.message,
      data: addClientToClassResponse.data,
      errors: null,
    };
  }
}
