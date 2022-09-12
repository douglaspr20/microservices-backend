import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ClassController } from './class.controller';
import { ConfigService } from './services/config.service';
import { ClassService } from './services/class.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: `${configService.get('mindbodyBaseUrl')}/class`,
        headers: {
          'API-Key': configService.get('mindbodyApiKey'),
          SiteId: configService.get('mindbodySiteId'),
        },
      }),
      inject: [ConfigService],
      extraProviders: [ConfigService],
    }),
  ],
  controllers: [ClassController],
  providers: [ClassService, ConfigService],
})
export class ClassModule {}
