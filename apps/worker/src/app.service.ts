import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { TaskMessage } from '@mono-ex/worker-contract';
import { generator } from '@mono-ex/indexed-string-variations';
import { z } from 'zod';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('RESULT_COLLECTOR_SERVICE') private client: ClientProxy,
  ) {}

  public processTask(task: z.infer<typeof TaskMessage>) {
    const variationGen = generator(task.alphabet);

    console.log(
      'Processing from ' +
        `${variationGen(task.batchStart)} (${task.batchStart}) ` +
        `to ${variationGen(task.batchEnd)} (${task.batchEnd})`,
    );

    for (let idx = task.batchStart; idx <= task.batchEnd; idx++) {
      const word = variationGen(idx);
      const shasum = createHash('sha1');
      shasum.update(word);
      const digest = shasum.digest('hex');
      if (digest === task.searchHash) {
        this.client.send('result', {
          taskId: task.taskId,
          searchHash: task.searchHash,
          originalMessage: word,
        });
        return;
      }
    }
  }
}
