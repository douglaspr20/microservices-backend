import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './services/appointment.service';
import { ConfigService } from './services/config.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, ConfigService],
})
export class AppointmentModule {}
