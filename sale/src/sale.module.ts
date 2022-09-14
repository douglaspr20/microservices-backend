import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SaleController } from './sale.controller';
import { SaleService } from './services/sale.service';
import { ConfigService } from './services/config.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: `${configService.get('mindbodyBaseUrl')}/sale`,
        headers: {
          'API-Key': configService.get('mindbodyApiKey'),
          SiteId: configService.get('mindbodySiteId'),
        },
      }),
      inject: [ConfigService],
      extraProviders: [ConfigService],
    }),
  ],
  controllers: [SaleController],
  providers: [SaleService, ConfigService],
})
export class SaleModule {}
