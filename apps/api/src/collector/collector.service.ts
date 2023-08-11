import { ResultMessage } from '@mono-ex/worker-contract';
import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollectorService {
  constructor(private prismaService: PrismaService) {}

  @MessagePattern('result')
  public collectResult(result: z.infer<typeof ResultMessage>) {
    const parsed = ResultMessage.parse(result);

    this.prismaService.hashsumResult.update({
      where: {
        searchHash: parsed.searchHash,
      },
      data: {
        originalString: parsed.originalMessage,
        completed: true,
      },
    });
  }
}
