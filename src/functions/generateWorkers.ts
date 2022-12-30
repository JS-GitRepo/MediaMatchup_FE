export const generateMatchupWorker = (): Worker => {
  let matchupWorker = new Worker(
    new URL("../webworkers/generateMatchupWorker.ts", import.meta.url),
    {
      type: "module",
    }
  );
  matchupWorker.postMessage("");
  return matchupWorker;
};

export const generateBufferWorker = (): Worker => {
  let generateBufferWorker = new Worker(
    new URL("../webworkers/bufferWorker.ts", import.meta.url),
    {
      type: "module",
    }
  );
  generateBufferWorker.postMessage("");
  return generateBufferWorker;
};
