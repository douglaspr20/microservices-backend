import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './services/config.service';
import { UserController } from './user.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [UserController],
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
    AppService,
  ],
})
export class AppModule {}
