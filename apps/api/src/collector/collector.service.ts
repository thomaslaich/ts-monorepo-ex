import { ResultMessage } from '@mono-ex/worker-contract';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollectorService {
  constructor(private prismaService: PrismaService) {}

  public async collectResult(result: z.infer<typeof ResultMessage>) {
    console.log('collecting result', result);
    const parsed = ResultMessage.parse(result);

    await this.prismaService.hashsumResult.update({
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
