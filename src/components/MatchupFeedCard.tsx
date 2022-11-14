import "./styles/MatchupFeedCard.css";
import { useContext } from "react";
import SocialContext from "../context/SocialContext";
import Matchup from "../models/Matchup";

interface Props {
  matchup: Matchup;
  key: string;
}

const MatchupFeedCard = ({ matchup }: Props) => {
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

  return (
    <div className='MatchupFeedCard'>
      <div className='media1-container'>
        <div className='image-subcontainer'>
          <img
            className={`media1-main-img main-img ${isWinner1}`}
            src={matchup?.media1.artImg}
            alt={`Main Image 1: ${matchup?.media1.title}`}
          />
        </div>
        <div className='text-subcontainer'>
          <p className='media1-title'>{matchup?.media1.title}</p>
          {/* <p className="media1-subtitle">{subtitle1}</p>
          <p className="media1-category">{`(${matchup?.media1.category})`}</p> */}
        </div>
        <img
          className='media1-bg-img bg-img'
          src={backgroundImg1}
          alt={`Background Image 1: ${matchup?.media1.title}`}
        />
      </div>
      <p className='vs'>VS</p>
      <div className='media2-container'>
        <div className='image-subcontainer'>
          <img
            className={`media2-main-img main-img ${isWinner2}`}
            src={matchup?.media2.artImg}
            alt={`Main Image 2: ${matchup?.media2.title}`}
          />
        </div>
        <div className='text-subcontainer'>
          <p className='media2-title'>{matchup?.media2.title}</p>
          {/* <p className="media2-subtitle">{subtitle2}</p>
          <p className="media2-category">{`(${matchup?.media2.category})`}</p> */}
        </div>
        <img
          className='media2-bg-img bg-img'
          src={backgroundImg2}
          alt={`Background Image 2: ${matchup?.media2.title}`}
        />
      </div>
    </div>
  );
};

export default MatchupFeedCard;
