import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './services/config.service';
import { UserController } from './user.controller';
import { ClientController } from './client.controller';
import { ClassController } from './class.controller';
import { AppService } from './services/app.service';
import { AppointmentController } from './appointment.controller';
@Module({
  imports: [],
  controllers: [
    UserController,
    ClientController,
    ClassController,
    AppointmentController,
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
    AppService,
  ],
})
export class AppModule {}
