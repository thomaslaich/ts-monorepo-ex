import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { TaskMessage } from '@mono-ex/worker-contract';
import { z } from 'zod';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('process_batch')
  processBatch(
    @Payload() data: z.infer<typeof TaskMessage>,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    const res = this.appService.processTask(data);
    if (res) res.subscribe();

    channel.ack(originalMsg);
  }
}
