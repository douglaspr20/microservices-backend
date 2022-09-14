import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './services/config.service';
import {
  UserController,
  AppointmentController,
  ClassController,
  ClientController,
  SaleController,
  EnrrollmentController,
} from './controllers';
import { AppService } from './services/app.service';
@Module({
  imports: [],
  controllers: [
    UserController,
    ClientController,
    ClassController,
    AppointmentController,
    SaleController,
    EnrrollmentController,
  ],
  providers: [
    ConfigService,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'TOKEN_SERVICE',
      useFactory: (configService: ConfigService) => {
        const tokenServiceOptions = configService.get('tokenService');
        return ClientProxyFactory.create(tokenServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'CLIENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const clientServiceOptions = configService.get('clientService');
        return ClientProxyFactory.create(clientServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'CLASS_SERVICE',
      useFactory: (configService: ConfigService) => {
        const classServiceOptions = configService.get('classService');
        return ClientProxyFactory.create(classServiceOptions);
      },
      inject: [ConfigService],
    },

    {
      provide: 'APPOINTMENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const appointmentServiceOptions =
          configService.get('appointmentService');
        return ClientProxyFactory.create(appointmentServiceOptions);
      },
      inject: [ConfigService],
    },

    {
      provide: 'SALE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const saleServiceOptions = configService.get('saleService');
        return ClientProxyFactory.create(saleServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'ENRROLLMENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const enrrollmentServiceOptions =
          configService.get('enrrollmentService');
        return ClientProxyFactory.create(enrrollmentServiceOptions);
      },
      inject: [ConfigService],
    },
    AppService,
  ],
})
export class AppModule {}
