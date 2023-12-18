import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );
  const config = new DocumentBuilder()
    .setTitle('Frankly Lottie Dashboard API')
    .setDescription(
      "This is the API for the Lottie Dashboard application for a Bachelor's project ‼ INTERNAL USE ONLY ‼",
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({ origin: '*', methods: '*', allowedHeaders: '*' });
  await app.listen(process.env.PORT || 3005);
}
bootstrap();
