import { createHash } from "crypto";
import generator from "./indexed-string-variation";

// TODO remove duplication
interface Task {
  searchHash: string;
  alphabet: string;
  batchStart: number;
  batchEnd: number;
}

export function processTask(task: Task) {
  const variationGen = generator(task.alphabet);

  console.log(
    "Processing from " +
      `${variationGen(task.batchStart)} (${task.batchStart}) ` +
      `to ${variationGen(task.batchEnd)} (${task.batchEnd})`
  );

  for (let idx = task.batchStart; idx <= task.batchEnd; idx++) {
    const word = variationGen(idx);
    const shasum = createHash("sha1");
    shasum.update(word);
    const digest = shasum.digest("hex");
    if (digest === task.searchHash) {
      return {
        searchHash: task.searchHash,
        word,
      };
    }
  }
}
