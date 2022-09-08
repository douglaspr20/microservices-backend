import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './services/config.service';
import { UserController } from './user.controller';
import { ClientController } from './client.controller';
import { AppService } from './services/app.service';
@Module({
  imports: [],
  controllers: [UserController, ClientController],
  providers: [
    ConfigService,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'CLIENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const clientServiceOptions = configService.get('clientService');
        return ClientProxyFactory.create(clientServiceOptions);
      },
    },
    AppService,
  ],
})
export class AppModule {}
