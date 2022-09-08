import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from './services/config.service';
import { ClientController } from './client.controller';
import { ClientService } from './services/client.service';

@Module({
  imports: [HttpModule],
  controllers: [ClientController],
  providers: [ClientService, ConfigService],
})
export class ClientModule {}
