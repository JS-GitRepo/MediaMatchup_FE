import { generateMatchupWorker } from "../functions/generateWorkers";
import { Matchup } from "../models/Matchup";

onmessage = async (e) => {
  // console.log("Buffer Worker Invoked");
  let tempBuffer: Matchup[] = e.data;
  let bufferLength = tempBuffer.length;
  // for (let i = bufferLength; i < 3; i++) {
  //   let matchupWorker = generateMatchupWorker();
  //   matchupWorker.onmessage = (e) => {
  //     tempBuffer.push(e.data);
  //     bufferLength = tempBuffer.length;
  //     matchupWorker.terminate();
  //   };
  // }
};
