import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from './core/constants/environment-variable.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('ATM Next Digital Service')
    .setDescription('ATM Next Digital Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/v1/docs', app, document);
  const portRunning = PORT || 300;
  await app.listen(portRunning);

  console.log(`App running on port ${portRunning}`);
}
bootstrap();
