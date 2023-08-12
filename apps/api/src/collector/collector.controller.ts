import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CollectorService } from './collector.service';
import { ResultMessage } from '@mono-ex/worker-contract';
import { z } from 'zod';

@Controller()
export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {}

  @MessagePattern('result')
  processResult(result: z.infer<typeof ResultMessage>) {
    this.collectorService.collectResult(result);
  }
}
