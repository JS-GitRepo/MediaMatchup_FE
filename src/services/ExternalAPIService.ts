import axios from "axios";
import MediaItem from "../models/MediaItem";

// const baseURL: string = `${import.meta.env.VITE_API_URL}` || "";
const tmdbKey: string = `${import.meta.env.VITE_TMDB_KEY}` || "";
const lastFMKey: string = `${import.meta.env.VITE_LASTFM_KEY}` || "";
const rawGKey: string = `${import.meta.env.VITE_RAWG_KEY}` || "";

// Searches for a list of popular movies,then picks a random page, then a specific result at random
export const getMovie = (): Promise<MediaItem> => {
  // randPageNum should be 1-62
  let randPageNum = Math.floor(Math.random() * 62) + 1;
  // randResultNum is for an array, so 1-20 actually equals 0-19
  let randResultNum = Math.floor(Math.random() * 20);
  // console.log(`Movie PageNum: ` + randPageNum, `ResultNum: ` + randResultNum);
  let paramsObj = {
    api_key: tmdbKey as string,
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    "vote_count.gte": "2990",
    page: randPageNum.toString(),
  };
  return axios
    .get(`https://api.themoviedb.org/3/discover/movie`, {
      params: paramsObj,
    })
    .then((response) => {
      let selection: any = response.data.results[randResultNum];
      // console.log(`Movie:`, selection);
      const movie: MediaItem = {
        title: selection.title,
        subtitle: selection.release_date,
        artImg: `https://image.tmdb.org/t/p/w500/${selection.poster_path}`,
        artImg2: `https://image.tmdb.org/t/p/w500/${selection.backdrop_path}`,
        category: "Film",
        nativeId: selection.id,
        winner: false,
      };
      return movie;
    });
};

// Searches for a list of TV shows, picks a random page, then picks a random result
export const getTVShow = (): Promise<MediaItem> => {
  // randPageNum should be 1-15
  let randPageNum = Math.floor(Math.random() * 15) + 1;
  // randResultNum is for an array, so 1-20 actually equals 0-19
  let randResultNum = Math.floor(Math.random() * 20);
  // console.log(`TVShow PageNum: ` + randPageNum, `ResultNum: ` + randResultNum);
  let paramsObj = {
    api_key: tmdbKey as string,
    language: "en-US",
    "vote_count.gte": "940",
    page: randPageNum.toString(),
  };
  return axios
    .get(`https://api.themoviedb.org/3/discover/tv`, {
      params: paramsObj,
    })
    .then((response) => {
      // console.log(`TV Show Page:` + paramsObj.page);
      let selection: any = response.data.results[randResultNum];
      // console.log(`TV Show:`, selection);
      const show: MediaItem = {
        title: selection.name,
        subtitle: selection.first_air_date,
        artImg: `https://image.tmdb.org/t/p/w500/${selection.poster_path}`,
        artImg2: `https://image.tmdb.org/t/p/w500/${selection.backdrop_path}`,
        category: "Television",
        nativeId: selection.id,
        winner: false,
      };
      return show;
    });
};

// Searches the met for an artpiece with a certain tag; cannot filter as robustly as others, so we need to search notable names and "similar"
export const getArtpiece = (): Promise<MediaItem> => {
  // Random number from 0-20; represents position in ObjectID array from API
  let randResultNum = Math.floor(Math.random() * 10);
  let artistArray = [
    "Vincent van Gogh",
    "Claude Monet",
    "Pablo Picasso",
    "Salvador Dali",
    "Rembrandt",
    "Jackson Pollock",
    "Andy Warhol",
    "Rothko",
    "Hokusai",
    "Leonardo Da Vinci",
    "Michelangelo",
    "Henri Matisse",
    "Georgia O'Keeffe",
    "Hieronymus Bosch",
    "Norman Rockwell",
    "Ivan Albright",
    "Hiroshi Yoshida",
    "yayoi kusama",
    "Kawanabe Kyosai",
  ];
  let randArtistNum = Math.floor(Math.random() * (artistArray.length + 1));
  // console.log(
  //   `Artpiece ArtistNum:` + randArtistNum,
  //   `ResultNum:` + randResultNum
  // );
  let paramsObj = {
    q: artistArray[randArtistNum],
    fields: "id, title, image_id, artist_title, date_end",
    page: 1,
    limit: 10,
  };

  return axios
    .get(`https://api.artic.edu/api/v1/artworks/search`, {
      params: paramsObj,
    })
    .then((response) => {
      let imageResponse = response.data.data[randResultNum].image_id;
      if (
        imageResponse === null ||
        imageResponse === "null" ||
        imageResponse === ""
      ) {
        randResultNum = Math.floor(Math.random() * 10);
      }

      let artSelection = response.data.data[randResultNum];
      const artpiece: MediaItem = {
        title: artSelection.title,
        subtitle: artSelection.artist_title,
        artImg: `https://www.artic.edu/iiif/2/${artSelection.image_id}/full/843,/0/default.jpg`,
        category: "Artpiece",
        nativeId: `${artSelection.artist_title}: ${artSelection.title}`,
        winner: false,
      };
      return artpiece;
    });
};

export const getAlbum = (): Promise<MediaItem> => {
  let randPageNum = Math.floor(Math.random() * 9) + 1;
  let randResultNum = Math.floor(Math.random() * 50);
  // console.log(
  //   `getAlbum PageNum: ` + randPageNum,
  //   `ResultNum: ` + randResultNum
  // );
  let paramsObj = {
    api_key: lastFMKey as string,
    method: "chart.gettopartists",
    format: "json",
    page: randPageNum.toString(),
  };
  return axios
    .get(`https://ws.audioscrobbler.com/2.0/`, {
      params: paramsObj,
    })
    .then((response) => {
      console.log(response.data.artists.artist[randResultNum].name);

      let artistID = response.data.artists.artist[randResultNum].name;
      let paramsObj2 = {
        api_key: lastFMKey as string,
        method: "artist.gettopalbums",
        format: "json",
        artist: artistID,
      };
      let randResultNum2 = Math.floor(Math.random() * 2);
      return axios
        .get(`https://ws.audioscrobbler.com/2.0/`, {
          params: paramsObj2,
        })
        .then((response) => {
          let selection: any = response.data.topalbums.album[randResultNum2];
          let selectionImg = Object.entries(selection.image[3])[0];
          const album: MediaItem = {
            title: selection.name,
            subtitle: selection.artist.name,
            artImg: selectionImg[1] as string,
            category: "Album",
            nativeId: `${selection.artist.name}: ${selection.name}`,
            winner: false,
          };
          // console.log(`Album:`, selection);
          return album;
        });
    });
};

// Searches for acclaimed video games, chooses a random page, chooses a random result, and then searches for the resutls ID to gather deeper info
export const getVideoGame = (): Promise<MediaItem> => {
  // randPageNum has +1 because its not an array; needs range of 1-20
  let randPageNum = Math.floor(Math.random() * 20) + 1;
  // randResultNum is for an array, so 1-20 actually equals 0-19
  let randResultNum = Math.floor(Math.random() * 20);
  // console.log(
  //   `VidGame PageNum: ` + randPageNum,
  //   `VidGame ResultNum: ` + randResultNum
  // );
  let paramsObj = {
    key: rawGKey as string,
    metacritic: "88,100",
    ordering: "-metacritic",
    exclude_additions: true,
    page: randPageNum.toString(),
  };
  return axios
    .get(`https://api.rawg.io/api/games`, {
      params: paramsObj,
    })
    .then((response) => {
      let gameID = response.data.results[randResultNum].id;
      return axios
        .get(`https://api.rawg.io/api/games/${gameID}`, {
          params: { key: rawGKey as string },
        })
        .then((response) => {
          let selection: any = response.data;
          let imagePrefix = "https://media.rawg.io/media";
          let imageTailURL = selection.background_image.split(imagePrefix)[1];
          let image2TailURL =
            selection.background_image_additional.split(imagePrefix)[1];
          // console.log(image2TailURL);
          const videoGame: MediaItem = {
            title: selection.name,
            subtitle: selection.released,
            artImg: `${imagePrefix}/resize/640/-${imageTailURL}`,
            artImg2: `${imagePrefix}/resize/640/-${image2TailURL}`,
            category: "Video Game",
            nativeId: selection.id,
            winner: false,
          };
          // console.log(`Video Game:`, response.data);
          return videoGame;
        });
    });
};
