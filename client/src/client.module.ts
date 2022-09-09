import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ClientController } from './client.controller';
import { ConfigService } from './services/config.service';
import { ClientService } from './services/client.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        headers: {
          'API-Key': configService.get('minbodyApiKey'),
          SiteId: configService.get('minbodySiteId'),
        },
      }),
      inject: [ConfigService],
      extraProviders: [ConfigService],
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService, ConfigService],
})
export class ClientModule {}
