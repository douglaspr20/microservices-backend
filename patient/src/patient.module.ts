import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PatientController } from './patient.controller';
import { ConfigService } from './services/config.service';
import { PatientService } from './services/patient.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: `${configService.get('cerboBaseUrl')}`,
          auth: {
            username: configService.get('cerboUsername'),
            password: configService.get('cerboSecretKey'),
          },
        };
      },
      inject: [ConfigService],
      extraProviders: [ConfigService],
    }),
  ],
  controllers: [PatientController],
  providers: [PatientService, ConfigService],
})
export class PatientModule {}
