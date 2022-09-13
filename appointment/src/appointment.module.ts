import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './services/appointment.service';
import { ConfigService } from './services/config.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: `${configService.get('mindbodyBaseUrl')}/appointment`,
        headers: {
          'API-Key': configService.get('mindbodyApiKey'),
          SiteId: configService.get('mindbodySiteId'),
        },
      }),
      inject: [ConfigService],
      extraProviders: [ConfigService],
    }),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService, ConfigService],
})
export class AppointmentModule {}
