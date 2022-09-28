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
import { IUser } from '../interfaces/user';
import { GetUserRequest } from '../decorators';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('classes')
export class ClassController {
  constructor(
    @Inject('CLASS_SERVICE') private readonly classServiceClient: ClientProxy,
  ) {}

  @Get()
  async getClasses(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @GetUserRequest() user: IUser,
  ): Promise<GetClassesResponseDto> {
    const getClassesResponse: IGetClassesResponse = await firstValueFrom(
      this.classServiceClient.send('get_classes', {
        limit,
        offset,
        mindBodyAuthorization: user.mindBodyToken,
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
    @GetUserRequest() user: IUser,
  ): Promise<GetClassDescriptionResponseDto> {
    const getClassDescriptionsResponse: IGetClassDescriptionResponse =
      await firstValueFrom(
        this.classServiceClient.send('class_descriptions', {
          ...queryParams,
          mindBodyAuthorization: user.mindBodyToken,
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
    @GetUserRequest() user: IUser,
  ): Promise<AddClientToClassResponseDto> {
    const addClientToClassResponse: IAddClientToClassResponse =
      await firstValueFrom(
        this.classServiceClient.send('add_client_to_class', {
          ...addClientToClassDto,
          mindBodyAuthorization: user.mindBodyToken,
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
