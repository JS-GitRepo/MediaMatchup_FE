import { Matchup } from "../models/Matchup";
import MediaItem from "../models/MediaItem";
import {
  getAlbum,
  getArtpiece,
  getMovie,
  getTVShow,
  getVideoGame,
} from "../services/ExternalAPIService";

const getMediaArray = [
  getAlbum,
  getArtpiece,
  getMovie,
  getTVShow,
  getVideoGame,
];

const generateMedia = async (selection: number): Promise<MediaItem> => {
  return await getMediaArray[selection]();
};

export const generateMatchup = async (): Promise<Matchup> => {
  const startTime = Date.now();
  let randSelection = Math.floor(Math.random() * 5);
  let randSelection2 = Math.floor(Math.random() * 5);
  while (randSelection2 === randSelection) {
    randSelection2 = Math.floor(Math.random() * 5);
  }

  let [media1, media2] = await Promise.all([
    generateMedia(randSelection),
    generateMedia(randSelection2),
  ]);

  while (
    media1.title === null ||
    undefined ||
    "" ||
    media1.subtitle === null ||
    undefined ||
    "" ||
    media1.artImg === null ||
    undefined ||
    ""
  ) {
    console.log(`Media1 generated again due to missing info.`);
    media1 = await generateMedia(randSelection);
  }
  while (
    media2.title === null ||
    undefined ||
    "" ||
    media2.subtitle === null ||
    undefined ||
    "" ||
    media2.artImg === null ||
    undefined ||
    ""
  ) {
    console.log(`Media2 generated again due to missing info.`);
    media2 = await generateMedia(randSelection2);
  }
  const endTime = Date.now() - startTime;
  // console.log(
  //   `The 'generateMatchup' function took ${endTime} ms to complete.`
  // );
  // console.log(media1, media2);
  // setMatchup({
  //   media1,
  //   media2,
  // });
  return { media1, media2 };
};

export const generateMultipleMatchups = async (
  quantity: number
): Promise<Matchup[]> => {
  let matchupArray: Promise<Matchup>[] = [];
  for (let i = 0; i < quantity; i++) {
    let matchup = generateMatchup();
    matchupArray.push(matchup);
  }
  return Promise.all(matchupArray);
};
