import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ClassModule } from './class.module';
import { ConfigService } from './services/config.service';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ClassModule,
    {
      transport: Transport.TCP,
      options: {
        host: configService.get('host'),
        port: configService.get('port'),
      },
    },
  );

  await app.listen();
}
bootstrap();
