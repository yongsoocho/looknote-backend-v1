import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as path from 'path';
import * as morgan from 'morgan';
import * as hpp from 'hpp';
import { RedisClient } from './util/redis';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  // app.enableCors({
  //   origin: ['https://looknote.co.kr', 'https://manager.looknote.co.kr'],
  //   credentials: true,
  // });
  app.use(helmet());
  app.use(hpp());
  app.disable('x-powered-by');
  app.use(morgan('common'));
  app.useStaticAssets(path.join(__dirname, './public'));

  await RedisClient.connect();
  RedisClient.on('error', function (err) {
    console.log(err);
  });
  await app.listen(process.env.PORT);
}

bootstrap();
