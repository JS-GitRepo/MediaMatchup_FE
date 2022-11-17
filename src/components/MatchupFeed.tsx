import "./styles/MatchupFeed.css";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import Matchup from "../models/Matchup";
import UserAccount from "../models/UserAccount";
import { getMatchupsByUID } from "../services/MatchupService";
import { getUserById } from "../services/UserService";
import MatchupFeedCard from "./MatchupFeedCard";

interface Props {
  setCurrentTitle: React.Dispatch<React.SetStateAction<string>>;
  userID: string | undefined;
}

const MatchupFeed = ({ setCurrentTitle, userID }: Props) => {
  const [userMatchups, setUserMatchups] = useState<Matchup[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount>();
  const { user, setIsFriendFeed } = useContext(SocialContext);
  const location = useLocation();

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
      setIsFriendFeed(false);
    } else {
      setIsFriendFeed(true);
    }
  };

  useEffect(() => {
    if (userID) {
      getAndSetMatchups();
      checkIsPersonalFeed();
      getAndSetFeedUserInfo();
    }
  }, [userID]);

  useEffect(() => {
    setCurrentTitle(`${currentUser?.name}'s Feed`);
  }, [currentUser]);

  return (
    <div className='MatchupFeed'>
      <ul className='matchup-feed-list'>
        {userMatchups.splice(0, 20).map((matchupCard, i) => {
          return (
            <MatchupFeedCard key={`Matchup: ${i}`} matchup={matchupCard} />
          );
        })}
      </ul>
    </div>
  );
};

export default MatchupFeed;
