import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { TokenController } from './token.controller';
import { TokenService } from './services/token.service';
import { ConfigService } from './services/config.service';
import { JwtConfigService } from './services/jwt-config.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: `${configService.get('mindbodyBaseUrl')}/userToken`,
        headers: {
          'API-Key': configService.get('mindbodyApiKey'),
          SiteId: configService.get('mindbodySiteId'),
        },
      }),
      inject: [ConfigService],
      extraProviders: [ConfigService],
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService, ConfigService, JwtConfigService],
})
export class TokenModule {}
