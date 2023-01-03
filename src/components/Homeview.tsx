import "./styles/Homeview.css";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import { Matchup } from "../models/Matchup";
import MediaItem from "../models/MediaItem";
import {
  getDailyMatchupCollection,
  postDailyMatchupCollection,
} from "../services/DailyMatchupService";
import { submitMatchup } from "../services/MatchupService";
import { getUserById, updateUserByID } from "../services/UserService";
import MatchupCard from "./MatchupCard";
import StatsCard from "./StatsCard";
import NavModal from "./NavModal";
import { animated, useTransition } from "@react-spring/web";
import SignIn from "./SignIn";
import { generateMultipleMatchups } from "../functions/generateMatchups";
import NavMenu from "./NavMenu";
import { generateMatchupWorker } from "../functions/generateWorkers";
import { generateDateInfo } from "../functions/utilityFunctions";

interface Props {
  currentDisplay: string;
  style: any;
}

const Homeview = ({ currentDisplay, style }: Props) => {
  //  = = = = = = VARIABLES = = = = =

  // - - - General - - -
  const { userAuth, userAccount } = useContext(SocialContext);
  const navigate = useNavigate();
  // - - - Matchups - - -
  const [dailyIsComplete, setDailyIsComplete] = useState<Boolean>(false);
  const [bufferedMatchups, setBufferedMatchups] = useState<Matchup[]>([]);
  const [toggleGenerateBuffer, setToggleGenerateBuffer] =
    useState<boolean>(false);
  const [matchup, setMatchup] = useState<Matchup>({
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
  });
  const [showGenerateButton, setShowGenerateButton] = useState(true);

  // - - - Animations - - -
  const [navModalIsActive, setNavModalIsActive] = useState<boolean>(false);
  const [toggleGenAnim, setToggleGenAnim] = useState<boolean>(false);
  const navModalTransition = useTransition(navModalIsActive, {
    from: { transform: "translateY(100%)" },
    enter: { transform: "translateY(0%)" },
    leave: { transform: "translateY(110%)" },
    exitBeforeEnter: false,
  });
  const location = useLocation();

  // = = = = = =  GENERATOR FUNCTIONS = = = = = =

  // >>>>>>>>>>>>>>>>>>>>> 'CHECK AND SET' FUNCTIONS <<<<<<<<<<<<<<<<<<<<<
  const checkAndSetBufferedMatchups = async (): Promise<void> => {
    let tempBuffer = bufferedMatchups;
    let bufferLength = tempBuffer.length;
    // console.log(
    //   `There are ${bufferLength} items in the buffer when generation started.`
    // );
    if (bufferLength < 3) {
      if (bufferLength === 0) {
        let matchupWorker = generateMatchupWorker();
        matchupWorker.onmessage = (e) => {
          setMatchup(e.data);
          tempBuffer.push(e.data);
          bufferLength++;
          for (let i = bufferLength; i < 3; i++) {
            let matchupWorker = generateMatchupWorker();
            matchupWorker.onmessage = (e) => {
              tempBuffer.push(e.data);
              bufferLength = tempBuffer.length;
              matchupWorker.terminate();
            };
          }
          matchupWorker.terminate();
        };
      } else {
        tempBuffer.shift();
        bufferLength = tempBuffer.length;
        for (let i = bufferLength; i < 3; i++) {
          let matchupWorker = generateMatchupWorker();
          matchupWorker.onmessage = (e) => {
            tempBuffer.push(e.data);
            bufferLength = tempBuffer.length;
            matchupWorker.terminate();
          };
        }
        setMatchup(tempBuffer[0]);
      }
    } else if (bufferLength === 3) {
      tempBuffer.shift();
      setMatchup(tempBuffer[0]);
      let matchupWorker = generateMatchupWorker();
      matchupWorker.onmessage = (e) => {
        let tempMatchup = e.data;
        tempBuffer.push(tempMatchup);
        matchupWorker.terminate();
      };
    } else {
      if (!tempBuffer[3].dailyMatchupsIndex) {
        tempBuffer.splice(0, bufferLength - 3);
      }
      tempBuffer.shift();
      setMatchup(tempBuffer[0]);
    }
    setBufferedMatchups(tempBuffer);
  };

  const checkAndSetDailyMatchups = async (): Promise<void> => {
    const tempUser = await getUserById(userAuth!.uid);
    const tempUserIndex = tempUser!.dailyMatchupsIndex;
    const tempUserDate = tempUser!.dailyMatchupsDate;
    const dateInfo = generateDateInfo();
    const detailedDate = dateInfo.detailedDate;
    const simpleDate = dateInfo.simpleDate;
    let todaysCollection = await getDailyMatchupCollection(simpleDate);
    let tempDailyIsComplete = dailyIsComplete;
    // console.log(tempUserDate);

    if (todaysCollection) {
      if (tempUserDate === todaysCollection.simpleDate) {
        if (tempUserIndex! >= 10) {
          tempDailyIsComplete = true;
          setDailyIsComplete(true);
        }
        todaysCollection.matchups.splice(0, tempUserIndex!);
      }

      if (todaysCollection.matchups.length === 1) {
        let matchupWorker = generateMatchupWorker();
        matchupWorker.onmessage = (e) => {
          todaysCollection.matchups.push(e.data);
          setBufferedMatchups(todaysCollection.matchups);
        };
      } else {
        setBufferedMatchups(todaysCollection.matchups);
      }

      if (tempDailyIsComplete === false) {
        setMatchup(todaysCollection.matchups[0]);
      } else {
        checkAndSetBufferedMatchups();
      }
    } else {
      let tempCollection = await generateMultipleMatchups(10);
      tempCollection = tempCollection.map((item, i) => ({
        ...item,
        dailyMatchupsIndex: i + 1,
        dailyMatchupsDate: simpleDate,
      }));
      let dailyMatchupCollection: any = {
        detailedDate: detailedDate,
        simpleDate: simpleDate,
        matchups: tempCollection,
      };
      postDailyMatchupCollection(dailyMatchupCollection);
      setBufferedMatchups(tempCollection);
      setMatchup(tempCollection[0]);
    }
  };

  const checkAndSetMatchups = async () => {
    checkAndSetBufferedMatchups();
    if (matchup?.dailyMatchupsIndex) {
      if (bufferedMatchups[0].dailyMatchupsIndex === 10) {
        setDailyIsComplete(true);
      }
    }
  };

  const submitUserMatchupHandler = async (
    winner: MediaItem,
    dailyMatchupIndex?: number
  ) => {
    setToggleGenAnim(!toggleGenAnim);
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
    matchup!.uid = userAuth?.uid;
    matchup!.handle = userAccount?.handle;
    matchup!.date = Date.now();
    matchup!.upvotes = 0;
    matchup!.downvotes = 0;
    submitMatchup(matchup!);

    if (matchup?.dailyMatchupsIndex) {
      let tempIndex = matchup!.dailyMatchupsIndex!;
      let updatesObj = {
        dailyMatchupsDate: matchup!.dailyMatchupsDate!,
        dailyMatchupsIndex: tempIndex,
      };
      // console.log(updatesObj);
      updateUserByID(userAuth!.uid as string, updatesObj);
    }
    // console.log("Daily Matchups Status: ", dailyMatchups);
    checkAndSetMatchups();
  };

  const generateMatchupButtonHandler = () => {
    if (!toggleGenerateBuffer) {
      checkAndSetMatchups();
      setToggleGenAnim(!toggleGenAnim);
      setToggleGenerateBuffer(true);
    }
  };

  const cardComponents = {
    matchupCard: (
      <MatchupCard
        matchup={matchup}
        onSubmitMatchup={submitUserMatchupHandler}
        checkAndSetMatchups={checkAndSetMatchups}
        setShowGenerateButton={setShowGenerateButton}
      />
    ),
    statsCard: <StatsCard />,
  };

  const navMenuTransition = () => {
    navigate("/nav/myfeed");
    setNavModalIsActive(true);
  };

  useEffect(() => {
    if (userAuth) {
      checkAndSetDailyMatchups();
    }
  }, [userAuth]);

  useEffect(() => {
    if (location.pathname === "/") {
      setNavModalIsActive(false);
    }
  }, [location]);

  useEffect(() => {
    console.log(bufferedMatchups);
  }, [matchup]);

  useEffect(() => {
    if (toggleGenerateBuffer)
      setTimeout(() => setToggleGenerateBuffer(false), 600);
  }, [toggleGenerateBuffer]);

  return (
    <animated.div className={`Homeview`}>
      {userAccount?.handle! ? (
        <>
          <div className='buffered-imgs'>
            <img src={bufferedMatchups[1]?.media1?.artImg} alt='buffered img' />
            <img src={bufferedMatchups[1]?.media2?.artImg} alt='buffered img' />
            <img
              src={bufferedMatchups[1]?.media1?.artImg2}
              alt='buffered bg img'
            />
            <img
              src={bufferedMatchups[1]?.media2?.artImg2}
              alt='buffered bg img'
            />
          </div>
          <div className='card-ctr'>
            {navModalTransition((style, item) =>
              item ? (
                <NavModal style={style} currentDisplay={currentDisplay} />
              ) : (
                ""
              )
            )}
            {cardComponents.matchupCard}
          </div>

          <NavMenu
            navMenuTransition={navMenuTransition}
            generateMatchupButtonHandler={generateMatchupButtonHandler}
            showGenerateButton={showGenerateButton}
            toggleGenAnim={toggleGenAnim}
          />
        </>
      ) : (
        <SignIn />
      )}
      <p className='alpha'>ALPHA v0.31</p>
    </animated.div>
  );
};

export default Homeview;
