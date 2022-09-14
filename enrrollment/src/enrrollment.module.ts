import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EnrrollmentController } from './enrrollment.controller';
import { ConfigService } from './services/config.service';
import { EnrrollmentService } from './services/enrrollment.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: `${configService.get('mindbodyBaseUrl')}/enrollment`,
        headers: {
          'API-Key': configService.get('mindbodyApiKey'),
          SiteId: configService.get('mindbodySiteId'),
        },
      }),
      inject: [ConfigService],
      extraProviders: [ConfigService],
    }),
  ],
  controllers: [EnrrollmentController],
  providers: [EnrrollmentService, ConfigService],
})
export class EnrrollmentModule {}
