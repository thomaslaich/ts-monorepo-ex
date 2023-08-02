import { Injectable } from '@nestjs/common';
import { ProducerService } from './producer/producer.service';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private producerService: ProducerService,
    private prisma: PrismaService,
  ) {}

  async getPreviousResults() {
    this.prisma.hashsumResult.findMany();
  }

  async getStringFromHashsum({
    searchHash,
    maxLength,
  }: {
    searchHash: string;
    maxLength: number;
  }) {
    this.producerService.sendTasks({
      searchHash,
      maxLength,
    });
  }
}
