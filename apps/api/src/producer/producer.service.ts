import { TaskMessage } from '@mono-ex/worker-contract';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const BATCH_SIZE = 10000;

@Injectable()
export class ProducerService {
  constructor(
    @Inject('WORKER_SERVICE') private client: ClientProxy,
    private prismaService: PrismaService,
  ) {}

  public async sendTasks({
    searchHash,
    maxLength,
  }: {
    searchHash: string;
    maxLength: number;
  }) {
    await this.prismaService.hashsumResult.create({
      data: {
        searchHash,
        completed: false,
      },
    });

    const taskId = randomUUID();
    const generatorObj = this.generateTasks(
      taskId,
      searchHash,
      ALPHABET,
      maxLength,
      BATCH_SIZE,
    );

    // TODO rxjs somehow?
    // TODO ack after every message is not very efficient maybe?
    for (const task of generatorObj) {
      this.client.send('process_batch', task);
    }
  }

  // TODO use rxjs
  private *generateTasks(
    taskId: string,
    searchHash: string,
    alphabet: string,
    maxWordLength: number,
    batchSize: number,
  ) {
    let nVariations = 0;
    for (let n = 1; n <= maxWordLength; n++) {
      nVariations += Math.pow(alphabet.length, n);
    }
    console.log(
      'Finding the hashsum source string over ' +
        `${nVariations} possible variations`,
    );
    let batchStart = 1;
    while (batchStart <= nVariations) {
      const batchEnd = Math.min(batchStart + batchSize - 1, nVariations);
      yield TaskMessage.parse({
        taskId,
        searchHash,
        alphabet: alphabet,
        batchStart,
        batchEnd,
      });
      batchStart = batchEnd + 1;
    }
  }
}
