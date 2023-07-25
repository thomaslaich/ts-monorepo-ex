import { createHash } from 'crypto';
import generator from './indexed-string-variation';
import { TaskMessage } from '@mono-ex/worker-contract';
import { z } from 'zod';

export function processTask(task: z.infer<typeof TaskMessage>) {
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
      return {
        taskId: task.taskId,
        searchHash: task.searchHash,
        word,
      };
    }
  }
}
