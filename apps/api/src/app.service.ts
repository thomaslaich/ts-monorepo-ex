import { Get, Injectable } from '@nestjs/common';
import amqp from 'amqplib';
import { randomUUID } from 'crypto';
import { ResultMessage, TaskMessage } from '@mono-ex/worker-contract';
import { z } from 'zod';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const BATCH_SIZE = 10000;
const TIMEOUT = 60000; // 1 minute
const uri = 'amqp://guest:guest@rabbitmq-service:5672';

let connected = false;
async function connectToMq() {
  while (!connected) {
    try {
      const connection = await amqp.connect(uri);
      const channel = await connection.createConfirmChannel();
      connected = true;

      return channel;
    } catch (e) {
      console.log('retrying in 1 sec', JSON.stringify(e));
    }
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve();
      }, 1000),
    );
  }
}

@Injectable()
export class AppService {
  constructor(
    private channel: amqp.ConfirmChannel,
    private tasksQueue: amqp.Replies.AssertQueue,
    private resultsQueue: amqp.Replies.AssertQueue,
  ) {}

  public static async create() {
    const channel = await connectToMq();
    if (!channel) {
      throw new Error('cannot connect to mq');
    }

    const tasksQueue = await channel.assertQueue('tasks_queue');
    const resultsQueue = await channel.assertQueue('results_queue');

    return new AppService(channel, tasksQueue, resultsQueue);
  }

  async getStringFromHashsum({
    searchHash,
    maxLength,
  }: {
    searchHash: string;
    maxLength: number;
  }) {
    const taskId = randomUUID();
    const generatorObj = this.generateTasks(
      taskId,
      searchHash,
      ALPHABET,
      maxLength,
      BATCH_SIZE,
    );

    for (const task of generatorObj) {
      this.channel.sendToQueue(
        this.tasksQueue.queue,
        Buffer.from(JSON.stringify(task)),
        {
          persistent: true,
        },
      );
    }
    await this.channel.waitForConfirms();

    const result = await new Promise<z.infer<typeof ResultMessage>>(
      (resolve, reject) => {
        setTimeout(() => {
          reject();
        }, TIMEOUT);
        this.channel.consume(this.resultsQueue.queue, (msg) => {
          if (!msg) {
            return;
          }
          resolve(ResultMessage.parse(JSON.parse(msg.content.toString())));
        });
      },
    );

    if (result.taskId === taskId) {
      return {
        result: result.originalMessage,
      };
    }
  }

  @Get()
  getHello() {
    return 'world';
  }

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
