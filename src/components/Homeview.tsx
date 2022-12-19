import "./styles/Homeview.css";
import {
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import shareIcon from "../media/navIcons/shareIcon.png";
import commentsIcon from "../media/navIcons/commentsIcon.png";
import generateIcon from "../media/navIcons/generateIcon.png";
import navIcon from "../media/navIcons/navIcon.png";
import NavModal from "./NavModal";
import { animated, useTransition } from "@react-spring/web";
import SignIn from "./SignIn";
import { generateMultipleMatchups } from "../functions/generateMatchups";

interface Props {
  currentDisplay: string;
  style: any;
}

const Homeview = ({ currentDisplay, style }: Props) => {
  //  = = = = = = VARIABLES = = = = =

  // - - - General - - -
  const { userAuth, userAccount } = useContext(SocialContext);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  let { nav } = useParams();
  const navigate = useNavigate();
  // - - - Matchups - - -
  const [dailyMatchups, setDailyMatchups] = useState<Matchup[]>([]);
  const [dailyIsComplete, setDailyIsComplete] = useState<Boolean>(false);
  const [bufferedMatchups, setBufferedMatchups] = useState<Matchup[]>([]);
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
  // - - - Animations - - -
  const location = useLocation();
  const [navModalIsActive, setNavModalIsActive] = useState<boolean>(false);
  const navModalTransition = useTransition(navModalIsActive, {
    from: { transform: "translateY(100%)" },
    enter: { transform: "translateY(0%)" },
    leave: { transform: "translateY(110%)" },
    exitBeforeEnter: false,
  });

  // = = = = = =  GENERATOR FUNCTIONS = = = = = =
  const generateMatchupWorker = () => {
    let matchupWorker = new Worker("src/webworkers/generateMatchupWorker.ts", {
      type: "module",
    });
    matchupWorker.postMessage("");
    return matchupWorker;
  };

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

  // >>>>>>>>>>>>>>>>>>>>> 'CHECK AND SET' FUNCTIONS <<<<<<<<<<<<<<<<<<<<<
  const checkAndSetBufferedMatchups = async (): Promise<void> => {
    let tempBuffer = bufferedMatchups;
    let bufferLength = tempBuffer.length;
    console.log(
      `There are ${bufferLength} items in the buffer when generation started.`
    );
    if (bufferLength < 3) {
      let matchupWorker = generateMatchupWorker();
      matchupWorker.onmessage = (e) => {
        let initialMatchup = e.data;
        setMatchup(initialMatchup);
        tempBuffer.push(initialMatchup);
        bufferLength = tempBuffer.length;
        for (let i = bufferLength; i < 3; i++) {
          let matchupWorker = generateMatchupWorker();

          matchupWorker.onmessage = (e) => {
            let newMatchup = e.data;
            tempBuffer.push(newMatchup);
            bufferLength = tempBuffer.length;
            matchupWorker.terminate();
          };
        }
        matchupWorker.terminate();
      };
    } else {
      if (bufferLength > 3) {
        tempBuffer.splice(0, bufferLength - 3);
      }
      tempBuffer.shift();
      setMatchup(tempBuffer[0]);
      let matchupWorker = generateMatchupWorker();
      matchupWorker.onmessage = (e) => {
        let tempMatchup = e.data;
        tempBuffer.push(tempMatchup);
        matchupWorker.terminate();
      };
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
        dailyMatchupsIndex: i + 1,
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
      if (dailyMatchups[0].dailyMatchupsIndex === 10) {
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
    matchup!.uid = userAuth?.uid;
    matchup!.handle = userAccount?.handle;
    matchup!.date = Date.now();
    matchup!.upvotes = 0;
    matchup!.downvotes = 0;
    submitMatchup(matchup!);

    if (dailyMatchups.length > 0) {
      let tempIndex = matchup!.dailyMatchupsIndex!;
      let updatesObj = {
        dailyMatchupsDate: matchup!.dailyMatchupsDate!,
        dailyMatchupsIndex: tempIndex,
      };
      // console.log(updatesObj);
      await updateUserByID(userAuth!.uid as string, updatesObj);
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
          <div className='nav-menu'>
            <ul>
              <li>
                <button>
                  <img className='shareIcon' src={shareIcon} alt='share' />
                </button>
              </li>
              <li>
                <button>
                  <img
                    className='commentsIcon'
                    src={commentsIcon}
                    alt='comments'
                  />
                </button>
              </li>
              {showGenerateButton ? (
                <li>
                  <button onClick={checkAndSetMatchups}>
                    <img
                      className='generateIcon'
                      src={generateIcon}
                      alt='generate'
                    />
                  </button>
                </li>
              ) : (
                ""
              )}
              <li>
                <button onClick={navMenuTransition}>
                  <img className='navIcon' src={navIcon} alt='nav menu' />
                </button>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <SignIn />
      )}
      <p className='alpha'>ALPHA v0.25</p>
    </animated.div>
  );
};

export default Homeview;
