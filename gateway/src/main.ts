import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { ConfigService } from './services/config.service';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // app.use(
  //   session({
  //     name: 'JYZEN_SESSION',
  //     secret: configService.get('secret'),
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: { maxAge: 604800000 },
  //   }),
  // );

  app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(configService.get('port'));
}
bootstrap();
