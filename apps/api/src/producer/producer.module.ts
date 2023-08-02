import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerService } from './producer.service';
import { amqpHost, amqpPort } from '../keys';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WORKER_SERVICE',
        transport: Transport.RMQ,
        options: {
          // TODO
          urls: [`amqp://${amqpHost}:${amqpPort}`],
          queue: 'tasks_queue',
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [ProducerService],
})
export class ProducerModule {}
