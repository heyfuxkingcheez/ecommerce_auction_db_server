import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { TEMP_FOLDER_PATH } from './common/const/path.const';
import { scheduleJob } from 'node-schedule';
import { HttpExceptionFilter } from './common/exception-filter/http.exception-filter';
import * as cookieParser from 'cookie-parser';

function deleteOldFiles() {
  const files = fs.readdirSync(TEMP_FOLDER_PATH);
  const now = Date.now();

  files.forEach((file) => {
    const filePath = path.join(TEMP_FOLDER_PATH, file);
    const stats = fs.statSync(filePath);

    const expirationTime = 5 * 60 * 1000;
    if (now - stats.mtimeMs > expirationTime) {
      fs.unlinkSync(filePath);
      console.log(`Delete file: ${filePath}`);
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api');
  app.enableCors({
    origin:
      // 'https://www.woogi.shop',
      'http://localhost:443',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
  console.log(`SERVER ON ${port}`);

  scheduleJob('0 0 * * * *', () => {
    console.log('Running deleteOldFiles...');
    deleteOldFiles();
  });
}
bootstrap();
