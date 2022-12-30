export const generateMatchupWorker = (): Worker => {
  let matchupWorker = new Worker("src/webworkers/generateMatchupWorker.ts", {
    type: "module",
  });
  matchupWorker.postMessage("");
  return matchupWorker;
};

export const generateBufferWorker = (): Worker => {
  let bufferWorker = new Worker("src/webworkers/bufferWorker.ts", {
    type: "module",
  });
  bufferWorker.postMessage("");
  return bufferWorker;
};
