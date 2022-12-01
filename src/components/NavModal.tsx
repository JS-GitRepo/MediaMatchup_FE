import "./styles/NavModal.css";
import { SetStateAction, useContext, useEffect, useState } from "react";
import SocialContext from "../context/SocialContext";
import MatchupFeed from "./MatchupFeed";
import NavFooter from "./NavFooter";
import NavHeader from "./NavHeader";
import NavFriends from "./NavFriends";
import NavCommunity from "./NavCommunity";
import { animated } from "@react-spring/web";
import { getUserById } from "../services/UserService";
import UserAccount from "../models/UserAccount";
import { useLocation } from "react-router-dom";

interface Props {
  currentDisplay: string;
  style: any;
}

const NavModal = ({ currentDisplay, style }: Props) => {
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [isFriendFeed, setisFriendFeed] = useState<boolean>(false);
  const { userAuth } = useContext(SocialContext);
  const location = useLocation();
  // const [currentDisplay, setCurrentDisplay] = useState("My Feed");
  const centerDisplay = {
    matchupFeed: (
      <MatchupFeed userID={userAuth?.uid} setCurrentTitle={setCurrentTitle} />
    ),
    navFriends: <NavFriends setCurrentTitle={setCurrentTitle} />,
    navCommunity: <NavCommunity />,
  };
  const [pageName, setPageName] = useState<string>("matchupFeed");

  useEffect(() => {
    setCurrentTitle(currentDisplay);
    if (currentDisplay === "My Feed") {
      setPageName("matchupFeed");
    } else if (currentDisplay === "Friends") {
      setPageName("navFriends");
    } else if (currentDisplay === "Community") {
      setPageName("navCommunity");
    }
  }, [location.pathname]);

  return (
    <animated.div style={style} className='NavModal'>
      <NavHeader currentTitle={currentTitle} />
      {centerDisplay[pageName as keyof typeof centerDisplay]}
      <NavFooter currentDisplay={currentDisplay} />
    </animated.div>
  );
};

export default NavModal;
