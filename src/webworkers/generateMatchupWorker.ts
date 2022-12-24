import { generateMatchup } from "../functions/generateMatchups";

onmessage = async (e) => {
  // console.log("Matchup Worker Invoked");

  postMessage(await generateMatchup());
};
