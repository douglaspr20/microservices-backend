import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ClientModule } from './client.module';
import { ConfigService } from './services/config.service';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ClientModule,
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
