import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { redisHost, redisPort } from './keys';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RESULT_COLLECTOR_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: redisHost,
          port: redisPort,
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
