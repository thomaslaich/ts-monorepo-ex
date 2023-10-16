import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { redisHost, redisPort } from './keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: redisHost,
      port: redisPort,
    },
  });

  // TODO investigate why this is necessary
  app.getHttpAdapter().getInstance().set('etag', false);

  await app.startAllMicroservices();
  await app.listen(5000);
}
bootstrap();
