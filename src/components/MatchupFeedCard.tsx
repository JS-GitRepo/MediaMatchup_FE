import "./styles/MatchupFeedCard.css";
import { useContext, useEffect, useState } from "react";
import SocialContext from "../context/SocialContext";
import { Matchup } from "../models/Matchup";
import {
  animated,
  SpringValue,
  useSpring,
  useTransition,
} from "@react-spring/web";
import { Link } from "react-router-dom";

interface Props {
  matchup: Matchup;
}

const MatchupFeedCard = ({ matchup }: Props) => {
  // - - - - - States - - - - -
  const [isOverlay1, setIsOverlay1] = useState<boolean>(false);
  const [isOverlay2, setIsOverlay2] = useState<boolean>(false);
  const { userAccount } = useContext(SocialContext);
  // - - - - - Animation - - - - -
  const overlayFadeConfig = {
    from: { opacity: "0%" },
    enter: { opacity: "100%" },
    leave: { opacity: "0%" },
    config: { mass: 0.5, tension: 270, friction: 18 },
  };

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

  const parseDate = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let date = new Date(matchup.date!);
    if (date.getFullYear() === 2022) {
      return `${monthNames[date.getMonth()].slice(
        0,
        3
      )} ${date.getDate()} ${date.getFullYear()}`;
    } else {
      return `${monthNames[date.getMonth()].slice(
        0,
        3
      )} ${date.getDate()} ${date.getFullYear()} `;
    }
  };
  const cardDate = parseDate();

  const handleOverlayClick = (
    setIsOverlay: React.Dispatch<React.SetStateAction<boolean>>,
    activate: boolean
  ) => {
    let timeout1 = 0;
    let timeout2 = 0;
    if (setIsOverlay === setIsOverlay1) {
      setIsOverlay1(true);
      if (activate) {
        timeout1 = setTimeout(() => setIsOverlay1(false), 7000);
        setIsOverlay1(true);
      } else {
        setIsOverlay1(false);
        clearTimeout(timeout1);
      }
    } else {
      setIsOverlay2(true);
      if (activate) {
        timeout2 = setTimeout(() => setIsOverlay2(false), 7000);
        setIsOverlay2(true);
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
      <div className='info-ctr'>
        <Link to={`/nav/friends/${matchup.uid}`} className='info-handle'>
          {matchup?.handle ? `@${matchup?.handle}` : `@${matchup.uid}`}
        </Link>
        <p>{` • `}</p>
        <p className='info-date'>{`${cardDate}`}</p>
      </div>
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
                <div className='text-container prevent-select'>
                  <p className='media-title'>{matchup?.media1.title}</p>
                  <p className='media-subtitle'>{subtitle1}</p>
                  <p className='media-category'>{`(${matchup?.media1.category})`}</p>
                </div>
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
                <div className='text-container prevent-select'>
                  <p className='media-title'>{matchup?.media2.title}</p>
                  <p className='media-subtitle'>{subtitle2}</p>
                  <p className='media-category'>{`(${matchup?.media2.category})`}</p>
                </div>
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
