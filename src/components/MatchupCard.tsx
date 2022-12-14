import "./styles/MatchupCard.css";
import { useEffect, useRef, useState } from "react";
import { Matchup } from "../models/Matchup";
import MediaItem from "../models/MediaItem";
import loading from "../media/loading.svg";
import Loading from "./Loading";
import { animated, config, useTransition } from "@react-spring/web";
import AnimatedRoutes from "./AnimatedRoutes";
import { truncateStringStart } from "../functions/utilityFunctions";

interface Props {
  matchup: Matchup;
  onSubmitMatchup: (winner: MediaItem, dailyMatchupIndex?: number) => void;
  checkAndSetMatchups: () => void;
  setShowGenerateButton: React.Dispatch<React.SetStateAction<boolean>>;
}

const MatchupCard = ({
  matchup,
  onSubmitMatchup,
  setShowGenerateButton,
}: Props) => {
  // Animation useStates
  const [media1Animation, setMedia1Animation] = useState<boolean>(false);
  const [media2Animation, setMedia2Animation] = useState<boolean>(false);
  const [crown1Animation, setCrown1Animation] = useState<boolean>(false);
  const [crown2Animation, setCrown2Animation] = useState<boolean>(false);
  const [navAnimation, setNavAnimation] = useState<boolean>(false);
  const matchupEnterAnim = useTransition(matchup, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    exitBeforeEnter: true,
    config: { tension: 70, friction: 25 },
  });
  const loadingEnterAnim = useTransition(matchup, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    exitBeforeEnter: true,
    config: { tension: 170, friction: 28 },
  });
  // General matchup funcionality use states
  const [matchupDefined, setMatchupDefined] = useState<boolean>(false);
  const [dailyIndex, setDailyIndex] = useState<number>(-1);
  //  Media and Matchup variable construction useStates
  const [title1, setTitle1] = useState<string>();
  const [title2, setTitle2] = useState<string>();
  const [subtitle1, setSubtitle1] = useState<string>();
  const [subtitle2, setSubtitle2] = useState<string>();
  const [mainImg1, setMainImg1] = useState<string>();
  const [mainImg2, setMainImg2] = useState<string>();
  const [bgImg1, setbgImg1] = useState<string>();
  const [bgImg2, setbgImg2] = useState<string>();
  const [mediaCategory1, setMediaCategory1] = useState<string>();
  const [mediaCategory2, setMediaCategory2] = useState<string>();
  // Wait for all images to load before showing them
  const [loadingImages, setLoadingImages] = useState<string[]>([]);
  const [imagesAreLoaded, setImagesAreLoaded] = useState<boolean>(false);
  const imageLoadedCounter = useRef(0);

  const constructMedia = async () => {
    let tempTitle1 = matchup?.media1.title as String;
    let tempTitle2 = matchup?.media2.title as String;
    setTitle1(
      tempTitle1.length >= 40
        ? truncateStringStart(matchup?.media1.title!, 60)
        : matchup?.media1.title
    );
    setTitle2(
      tempTitle2.length >= 40
        ? truncateStringStart(matchup?.media2.title!, 60)
        : matchup?.media2.title
    );
    setSubtitle1(matchup?.media1.subtitle);
    setSubtitle2(matchup?.media2.subtitle);
    setMediaCategory1(matchup?.media1.category);
    setMediaCategory2(matchup?.media2.category);
    setMainImg1(matchup?.media1.artImg);
    setMainImg2(matchup?.media2.artImg);
    setbgImg1(
      matchup?.media1.artImg2 ? matchup?.media1.artImg2 : matchup?.media1.artImg
    );
    setbgImg2(
      matchup?.media2.artImg2 ? matchup?.media2.artImg2 : matchup?.media2.artImg
    );
    if (
      matchup?.media1.category === "Video Game" ||
      matchup?.media1.category === "Film" ||
      matchup?.media1.category === "Television"
    ) {
      setSubtitle1(matchup?.media1.subtitle.substring(0, 4));
    }
    if (
      matchup?.media2.category === "Video Game" ||
      matchup?.media2.category === "Film" ||
      matchup?.media2.category === "Television"
    ) {
      setSubtitle2(matchup?.media2.subtitle.substring(0, 4));
    }
  };

  const resetMatchup = () => {
    imageLoadedCounter.current = 0;
    setImagesAreLoaded(false);
    setMatchupDefined(false);
    setLoadingImages([
      matchup?.media1?.artImg!,
      matchup?.media2?.artImg!,
      matchup?.media1?.artImg2!,
      matchup?.media2?.artImg2!,
    ]);
    checkAndSetDailyIndex();
    constructMedia();
    if (
      !title1 ||
      !title2 ||
      !subtitle1 ||
      !subtitle2 ||
      !mainImg1 ||
      !mainImg2 ||
      !bgImg1 ||
      !bgImg2 ||
      !mediaCategory1 ||
      !mediaCategory2
    ) {
      setMatchupDefined(false);
    }
  };

  const winnerAnimation = (
    whichMedia: number,
    winner: MediaItem,
    dailyMatchupIndex?: number
  ) => {
    if (whichMedia === 1) {
      setMedia1Animation(true);
      setTimeout(() => setMedia1Animation(false), 500);
      setCrown1Animation(true);
      setTimeout(() => setCrown1Animation(false), 500);
    } else {
      setMedia2Animation(true);
      setTimeout(() => setMedia2Animation(false), 500);
      setCrown2Animation(true);
      setTimeout(() => setCrown2Animation(false), 500);
    }
    setTimeout(() => onSubmitMatchup(winner, dailyMatchupIndex), 400);
  };

  const checkAndSetDailyIndex = () => {
    let currentDailyIndex = matchup?.dailyMatchupsIndex!;
    if (currentDailyIndex <= 9 && currentDailyIndex >= 0) {
      setDailyIndex(currentDailyIndex);
      setShowGenerateButton(false);
    } else if (currentDailyIndex === 10) {
      setDailyIndex(currentDailyIndex);
      setShowGenerateButton(false);
    } else if (dailyIndex === 10) {
      setShowGenerateButton(true);
      setDailyIndex(dailyIndex + 1);
    } else if (dailyIndex >= 10) {
      setShowGenerateButton(true);
    }
  };

  const imageLoaded = () => {
    imageLoadedCounter.current += 1;
    if (imageLoadedCounter.current >= 2) {
      setImagesAreLoaded(true);
    }
  };

  useEffect(() => {
    resetMatchup();
  }, [matchup]);

  useEffect(() => {
    if (bgImg1 && bgImg2) {
      setMatchupDefined(true);
    }
  }, [bgImg1, bgImg2, matchup]);

  useEffect(() => {}, [imagesAreLoaded]);

  useEffect(() => {
    if (!crown1Animation) {
      setImagesAreLoaded(false);
    }
  }, [crown1Animation]);

  useEffect(() => {
    if (!crown2Animation) {
      setImagesAreLoaded(false);
    }
  }, [crown2Animation]);

  let dailyHeaderJSX = <div></div>;
  if (dailyIndex <= 10 && dailyIndex >= 0) {
    dailyHeaderJSX = (
      <div className='daily-header'>
        <p>{`Daily Matchup: ${dailyIndex}`}</p>
      </div>
    );
  } else {
    <div></div>;
  }

  return matchupEnterAnim((style, item) => (
    <>
      {!matchupDefined ? (
        <div className='MatchupCardLoading full-h-w'>
          <Loading adtlClassName={""} />
        </div>
      ) : (
        <animated.div
          style={style}
          className={`MatchupCard ${navAnimation ? "nav-animation" : ""}`}>
          {dailyHeaderJSX}

          {/* - - - - - Background "winner crown" animation behind each media item - - - - - */}
          <i
            className={`fa-solid fa-crown${
              crown1Animation ? " crownAnimation1" : ""
            }`}></i>

          {/* - - - - - Media 1 Container - - - - - */}
          <div
            className={`media-container media1-container${
              media1Animation ? " animOut1" : ""
            }`}
            onClick={() =>
              winnerAnimation(1, matchup?.media1!, matchup?.dailyMatchupsIndex)
            }>
            <animated.div className='image-subcontainer'>
              <img
                className={`media1-main-img main-img`}
                src={imagesAreLoaded ? mainImg1 : loading}
                alt={`Main Image 1: ${title1}`}
                onLoad={imageLoaded}
              />
            </animated.div>
            <animated.div className={`text-subcontainer prevent-select`}>
              <p className='media-title'>{title1}</p>
              <p className='media-subtitle'>{subtitle1}</p>
              <p className='media-category'>{`( ${mediaCategory1} )`}</p>
            </animated.div>
            <img
              className={`media1-bg-img bg-img`}
              src={imagesAreLoaded ? bgImg1 : ""}
              alt={`Background Image 1: ${title1}`}
              // onLoad={imageLoaded}
            />
          </div>

          <p className='vs'>VS</p>

          {/* - - - - - Background "winner crown" animation behind each media item - - - - - */}
          <i
            className={`fa-solid fa-crown${
              crown2Animation ? " crownAnimation2" : ""
            }`}></i>

          {/* - - - - - Media 2 Container - - - - - */}
          <div
            className={`media-container media2-container${
              media2Animation ? " animOut2" : ""
            }`}
            onClick={() =>
              winnerAnimation(2, matchup?.media2!, matchup?.dailyMatchupsIndex)
            }>
            <animated.div className='image-subcontainer'>
              <img
                className={`media2-main-img main-img`}
                src={imagesAreLoaded ? mainImg2 : loading}
                alt={`Main Image 2: ${mainImg2}`}
                onLoad={imageLoaded}
              />
            </animated.div>
            <animated.div className='text-subcontainer prevent-select'>
              <p className='media-title'>{title2}</p>
              <p className='media-subtitle'>{subtitle2}</p>
              <p className='media-category'>{`( ${mediaCategory2} )`}</p>
            </animated.div>
            <img
              className={`media2-bg-img bg-img`}
              src={imagesAreLoaded ? bgImg2 : ""}
              alt={`Background Image 2: ${title2}`}
              // onLoad={imageLoaded}
            />
          </div>
        </animated.div>
      )}
    </>
  ));
};

export default MatchupCard;
