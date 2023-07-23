interface Task {
  searchHash: string;
  alphabet: string;
  batchStart: number;
  batchEnd: number;
}

export function* generateTasks(
  searchHash: string,
  alphabet: string,
  maxWordLength: number,
  batchSize: number
): Generator<Task> {
  let nVariations = 0;
  for (let n = 1; n <= maxWordLength; n++) {
    nVariations += Math.pow(alphabet.length, n);
  }
  console.log(
    "Finding the hashsum source string over " +
      `${nVariations} possible variations`
  );
  let batchStart = 1;
  while (batchStart <= nVariations) {
    const batchEnd = Math.min(batchStart + batchSize - 1, nVariations);
    yield {
      searchHash,
      alphabet: alphabet,
      batchStart,
      batchEnd,
    };
    batchStart = batchEnd + 1;
  }
}
