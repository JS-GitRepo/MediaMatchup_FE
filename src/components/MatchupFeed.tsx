import "./styles/MatchupFeed.css";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import Matchup from "../models/Matchup";
import UserAccount from "../models/UserAccount";
import { getMatchupsByUID } from "../services/MatchupService";
import { getUserById } from "../services/UserService";
import MatchupFeedCard from "./MatchupFeedCard";

interface Props {
  userID: string | undefined;
  currentDisplay: string;
}

const MatchupFeed = ({ userID, currentDisplay }: Props) => {
  const [userMatchups, setUserMatchups] = useState<Matchup[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount>();
  const [isPersonalFeed, setIsPersonalFeed] = useState<Boolean>(false);
  const { user } = useContext(SocialContext);

  const getAndSetFeedUserInfo = async () => {
    getUserById(userID!).then((response) => {
      setCurrentUser(response!);
    });
  };

  const getAndSetMatchups = () => {
    getMatchupsByUID(userID!).then((response) => {
      setUserMatchups(response);
    });
  };

  const checkIsPersonalFeed = () => {
    if (user!.uid === userID) {
      setIsPersonalFeed(true);
    } else {
      setIsPersonalFeed(false);
    }
  };

  useEffect(() => {
    if (userID) {
      getAndSetMatchups();
      checkIsPersonalFeed();
      getAndSetFeedUserInfo();
    }
  }, [userID]);

  return (
    <div className='MatchupFeed'>
      <div className='matchup-feed-heading'>
        <h1 className='title'>
          {!isPersonalFeed ? (
            <Link className='left-nav' to={`/nav/friends`}>
              <span className='material-icons'>chevron_left</span>
            </Link>
          ) : (
            ""
          )}
          {`${currentUser?.name}'s Feed`}
        </h1>
      </div>
      <ul className='matchup-feed-list'>
        {userMatchups.map((matchupCard, i) => {
          return (
            <MatchupFeedCard key={`Matchup: ${i}`} matchup={matchupCard} />
          );
        })}
      </ul>
    </div>
  );
};

export default MatchupFeed;
