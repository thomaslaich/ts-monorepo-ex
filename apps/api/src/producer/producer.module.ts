import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerService } from './producer.service';
import { amqpHost, amqpPort } from '../keys';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WORKER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${amqpHost}:${amqpPort}`],
          queue: 'tasks_queue',
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    PrismaModule,
  ],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}
