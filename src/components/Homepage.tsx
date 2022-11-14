import "./styles/Homepage.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import { signInWithGoogle } from "../firebaseConfig";
import Matchup from "../models/Matchup";
import MediaItem from "../models/MediaItem";
import {
  getDailyMatchupCollection,
  postDailyMatchupCollection,
} from "../services/DailyMatchupService";
import {
  getAlbum,
  getArtpiece,
  getMovie,
  getTVShow,
  getVideoGame,
} from "../services/ExternalAPIService";
import { submitMatchup } from "../services/MatchupService";
import { getUserById, updateUserDailiesByID } from "../services/UserService";
import MatchupCard from "./MatchupCard";
import StatsCard from "./StatsCard";
import chevron from "../images/wide_chevron.png";
import { animated, useTransition } from "react-spring";

interface Props {
  style: any;
}

const Homepage = ({ style }: Props) => {
  //  = = = = = = VARIABLES = = = = =
  const defaultMatchup: Matchup = {
    media1: {
      title: "",
      subtitle: "",
      artImg: "",
      category: "",
    },
    media2: {
      title: "",
      subtitle: "",
      artImg: "",
      category: "",
    },
  };
  const [dailyMatchups, setDailyMatchups] = useState<Matchup[]>([]);
  const [dailyIsComplete, setDailyIsComplete] = useState<Boolean>(false);
  const [bufferedMatchups, setBufferedMatchups] = useState<Matchup[]>([]);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const [matchup, setMatchup] = useState<Matchup>(defaultMatchup);
  const bgImgURL =
    "https://apollo.imgix.net/content/uploads/2018/02/LEADPablo-Picasso-Femme-au-beret-et-a-la-robe-quadrillee-Marie-Therese-Walter-December-1937.jpg?auto=compress,format&crop=faces,entropy,edges&fit=crop&w=900&h=600";

  const { user } = useContext(SocialContext);
  const navigate = useNavigate();
  const getMediaArray = [
    // getAlbum,
    getArtpiece,
    getMovie,
    getTVShow,
    getVideoGame,
  ];
  // - - - Animations - - -
  const [navAnimation, setNavAnimation] = useState<boolean>(false);
  const navTransition = useTransition(navAnimation, {});

  // = = = = = =  GENERATOR FUNCTIONS = = = = = =
  const generateDateInfo = () => {
    const currentDate: Date = new Date();
    const detailedDate: number = Date.now();
    const simpleDate: number = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
      0
    );
    return { currentDate, detailedDate, simpleDate };
  };

  const generateMedia = async (selection: number): Promise<MediaItem> => {
    return await getMediaArray[selection]();
  };

  const generateMatchup = async (): Promise<Matchup> => {
    const startTime = Date.now();
    let randSelection = Math.floor(Math.random() * 4);
    let randSelection2 = Math.floor(Math.random() * 4);
    while (randSelection2 === randSelection) {
      randSelection2 = Math.floor(Math.random() * 4);
    }

    let [media1, media2] = await Promise.all([
      generateMedia(randSelection),
      generateMedia(randSelection2),
    ]);

    if (
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
    if (
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
    console.log(
      `The 'generateMatchup' function took ${endTime} ms to complete.`
    );
    // console.log(media1, media2);
    // setMatchup({
    //   media1,
    //   media2,
    // });
    return { media1, media2 };
  };

  const generateMultipleMatchups = (quantity: number): Promise<Matchup[]> => {
    let matchupArray: Promise<Matchup>[] = [];
    for (let i = 0; i < quantity; i++) {
      matchupArray.push(generateMatchup());
    }
    return Promise.all(matchupArray);
  };

  // >>>>>>>>>>>>>>>>>>>>> 'CHECK AND SET' FUNCTIONS <<<<<<<<<<<<<<<<<<<<<
  const checkAndSetBufferedMatchups = async (): Promise<void> => {
    let tempBuffer = bufferedMatchups;
    let bufferLength = tempBuffer.length;
    // console.log(
    //   `There are ${bufferLength} items in the buffer when generation started.`
    // );
    if (bufferLength < 3) {
      let initialMatchup = await generateMatchup();
      setMatchup(initialMatchup);
      tempBuffer.push(initialMatchup);
      bufferLength = tempBuffer.length;
      for (bufferLength; bufferLength < 3; bufferLength++) {
        let newMatchup = await generateMatchup();
        tempBuffer.push(newMatchup);
      }
    } else {
      tempBuffer.shift();
      setMatchup(bufferedMatchups[0]);
      let tempMatchup = await generateMatchup();
      tempBuffer.push(tempMatchup);
    }
    setBufferedMatchups(tempBuffer);
  };

  const checkAndSetDailyMatchups = async (): Promise<void> => {
    const tempUser = await getUserById(user!.uid);
    const tempUserIndex = tempUser!.dailyMatchupsIndex;
    const tempUserDate = tempUser!.dailyMatchupsDate;
    const dateInfo = generateDateInfo();
    const detailedDate = dateInfo.detailedDate;
    const simpleDate = dateInfo.simpleDate;
    let todaysCollection = await getDailyMatchupCollection(simpleDate);
    let tempDailyIsComplete = dailyIsComplete;
    console.log(tempUserDate);

    if (todaysCollection) {
      if (tempUserDate === todaysCollection.simpleDate) {
        if (tempUserIndex === 9) {
          tempDailyIsComplete = true;
          setDailyIsComplete(true);
        }
        todaysCollection.matchups.splice(0, tempUserIndex! + 1);
      }

      setDailyMatchups(todaysCollection.matchups);

      if (tempDailyIsComplete === false) {
        setMatchup(todaysCollection.matchups[0]);
      } else {
        checkAndSetBufferedMatchups();
      }
    } else {
      let tempCollection = await generateMultipleMatchups(10);
      tempCollection = tempCollection.map((item, i) => ({
        ...item,
        dailyMatchupsIndex: i,
        dailyMatchupsDate: simpleDate,
      }));
      let dailyMatchupCollection: any = {
        detailedDate: detailedDate,
        simpleDate: simpleDate,
        matchups: tempCollection,
      };
      postDailyMatchupCollection(dailyMatchupCollection);
      setDailyMatchups(tempCollection);
      setMatchup(tempCollection[0]);
    }
  };

  const checkAndSetMatchups = async () => {
    let tempDailyIsComplete = dailyIsComplete;
    if (matchup!.dailyMatchupsIndex) {
      if (dailyMatchups[0].dailyMatchupsIndex === 9) {
        tempDailyIsComplete = true;
        setDailyIsComplete(true);
        dailyMatchups?.shift();
      }
    }
    if (tempDailyIsComplete) {
      await checkAndSetBufferedMatchups();
    } else {
      dailyMatchups?.shift();
      setMatchup(dailyMatchups![0]);
    }
  };

  const submitUserMatchupHandler = async (
    winner: MediaItem,
    dailyMatchupIndex?: number
  ) => {
    // Establishes the winner based on which div is clicked (passed up via props)
    if (winner === matchup?.media1) {
      matchup.media1.winner = true;
      matchup.media2.winner = false;
      matchup.winner = matchup.media1.title;
    } else if (winner === matchup?.media2) {
      matchup.media1.winner = false;
      matchup.media2.winner = true;
      matchup.winner = matchup.media2.title;
    }
    matchup!.uid = user?.uid;
    matchup!.date = Date.now();
    matchup!.upvotes = 0;
    matchup!.downvotes = 0;
    submitMatchup(matchup!);

    if (dailyMatchups.length > 0) {
      let updatesObj = {
        dailyMatchupsDate: matchup!.dailyMatchupsDate!,
        dailyMatchupsIndex: matchup!.dailyMatchupsIndex!,
      };
      console.log(updatesObj);
      await updateUserDailiesByID(user!.uid as string, updatesObj);
    }
    // console.log("Daily Matchups Status: ", dailyMatchups);
    checkAndSetMatchups();
  };

  const cardComponents = {
    matchupCard: (
      <MatchupCard
        matchup={matchup}
        onSubmitMatchup={submitUserMatchupHandler}
        checkAndSetMatchups={checkAndSetMatchups}
      />
    ),
    statsCard: <StatsCard />,
  };

  const navMenuTransition = () => {
    setNavAnimation(true);
    setTimeout(() => {
      navigate("/nav/myfeed");
    }, 400);
  };

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  useEffect(() => {
    if (user) {
      checkAndSetDailyMatchups();
    }
  }, [user]);

  //  Logs bufferedMatchups whenever the current matchup changes (to make sure the buffer is updating)
  useEffect(() => {
    if (!isInitialRender && bufferedMatchups.length > 0) {
      console.log("Current Matchup Buffer: ", bufferedMatchups);
    }
  }, [matchup]);

  return (
    <animated.div className={`Homepage`}>
      {user ? (
        <div>
          {cardComponents.matchupCard}
          <div className='nav-menu'>
            <img
              className='nav-chevron'
              onClick={() => navMenuTransition()}
              src={chevron}
              alt='navigation icon'
            />
          </div>
        </div>
      ) : (
        <div className='sign-in-container'>
          <p onClick={signInWithGoogle}>Sign In With Google</p>
          <img
            className='sign-in-bg-img'
            src={bgImgURL}
            alt='login background image'
          />
        </div>
      )}
    </animated.div>
  );
};

export default Homepage;
