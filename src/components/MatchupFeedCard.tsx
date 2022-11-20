import "./styles/MatchupFeedCard.css";
import { useContext, useEffect, useState } from "react";
import SocialContext from "../context/SocialContext";
import Matchup from "../models/Matchup";
import {
  animated,
  SpringValue,
  useSpring,
  useTransition,
} from "@react-spring/web";

interface Props {
  matchup: Matchup;
}

const MatchupFeedCard = ({ matchup }: Props) => {
  // - - - - - States - - - - -
  const [isOverlay1, setIsOverlay1] = useState<boolean>(false);
  const [isOverlay2, setIsOverlay2] = useState<boolean>(false);
  const randTension = Math.floor(Math.random() * (390 - 300) + 300);
  const randFriction = Math.floor(Math.random() * (60 - 30) + 30);
  const randBSBlur_From = Math.floor(Math.random() * (12 - 8) + 8).toString();
  const randBSBlur_To = Math.floor(Math.random() * (20 - 8) - 8).toString();
  const randBSSpread_From = Math.floor(Math.random() * (4 - 1) - 1).toString();
  const randBSSpread_To = Math.floor(Math.random() * (15 - 8) - 8).toString();
  const boxShadowTo: string =
    `0 0 ${randBSBlur_From}px ${randBSSpread_From}px rgb(203, 191, 31)` as string;
  const boxShadowFrom: string =
    `0 0 ${randBSBlur_From}px ${randBSSpread_From}px rgb(203, 191, 31)` as string;
  // - - - - - Animation - - - - -
  const overlayFadeConfig = {
    from: { opacity: "0%" },
    enter: { opacity: "100%" },
    leave: { opacity: "0%" },
    config: { mass: 0.5, tension: 270, friction: 18 },
  };
  // const winnerAnimLayer1 = useSpring({
  //   from: {
  //     boxShadow: boxShadowFrom,
  //   },
  //   to: {
  //     boxShadow: boxShadowTo,
  //   },
  //   loop: { reverse: true },
  //   config: { mass: 1, tension: 380, friction: 60 },
  // });
  const overlay1Fade = useTransition(isOverlay1, overlayFadeConfig);
  const overlay2Fade = useTransition(isOverlay2, overlayFadeConfig);

  let subtitle1 = matchup?.media1.subtitle;
  let subtitle2 = matchup?.media2.subtitle;
  let backgroundImg1 = matchup?.media1.artImg2
    ? matchup.media1.artImg2
    : matchup?.media1.artImg;
  let backgroundImg2 = matchup?.media2.artImg2
    ? matchup?.media2.artImg2
    : matchup?.media2.artImg;
  let isWinner1 = matchup?.media1.winner ? "winner" : "";
  let isWinner2 = matchup?.media2.winner ? "winner" : "";
  const { user } = useContext(SocialContext);

  if (
    matchup?.media1.category === "Video Game" ||
    matchup?.media1.category === "Film" ||
    matchup?.media1.category === "Television"
  ) {
    subtitle1 = matchup?.media1.subtitle.substring(0, 4);
  }
  if (
    matchup?.media2.category === "Video Game" ||
    matchup?.media2.category === "Film" ||
    matchup?.media2.category === "Television"
  ) {
    subtitle2 = matchup?.media2.subtitle.substring(0, 4);
  }

  const handleOverlayClick = (
    setIsOverlay: React.Dispatch<React.SetStateAction<boolean>>,
    activate: boolean
  ) => {
    let timeout1 = setTimeout(() => setIsOverlay1(false), 7000);
    let timeout2 = setTimeout(() => setIsOverlay2(false), 7000);
    if (setIsOverlay === setIsOverlay1) {
      if (activate) {
        setIsOverlay1(true);
        timeout1;
      } else {
        setIsOverlay1(false);
        clearTimeout(timeout1);
      }
    } else {
      if (activate) {
        setIsOverlay2(true);
        timeout2;
      } else {
        setIsOverlay2(false);
        clearTimeout(timeout2);
      }
    }
  };

  return (
    <div className='MatchupFeedCard'>
      <img
        className={"bg-img"}
        src={matchup?.media1.winner ? backgroundImg1 : backgroundImg2}
        alt='winner background image'
      />

      <div className='media-container'>
        <div className='image-subcontainer'>
          <img
            className={`media1-main-img main-img ${isWinner1}`}
            src={matchup?.media1.artImg}
            alt={`Main Image 1: ${matchup?.media1.title}`}
            onClick={() => handleOverlayClick(setIsOverlay1, true)}
          />
          {overlay1Fade((style, item) =>
            item ? (
              <animated.div
                className='image-overlay prevent-select'
                style={style}
                onClick={() => handleOverlayClick(setIsOverlay1, false)}>
                <p className='media1-title'>{matchup?.media1.title}</p>
                <p className='media1-subtitle'>{subtitle1}</p>
                <p className='media1-category'>{`(${matchup?.media1.category})`}</p>
              </animated.div>
            ) : (
              <></>
            )
          )}
        </div>
      </div>

      <p className='vs'>VS</p>

      <div className='media-container'>
        <div className='image-subcontainer'>
          <img
            className={`media2-main-img main-img ${isWinner2}`}
            src={matchup?.media2.artImg}
            alt={`Main Image 2: ${matchup?.media2.title}`}
            onClick={() => handleOverlayClick(setIsOverlay2, true)}
          />
          {overlay2Fade((style, item) =>
            item ? (
              <animated.div
                className='image-overlay prevent-select'
                style={style}
                onClick={() => handleOverlayClick(setIsOverlay2, false)}>
                <p className='media2-title'>{matchup?.media2.title}</p>
                <p className='media2-subtitle'>{subtitle2}</p>
                <p className='media2-category'>{`(${matchup?.media2.category})`}</p>
              </animated.div>
            ) : (
              <></>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchupFeedCard;
