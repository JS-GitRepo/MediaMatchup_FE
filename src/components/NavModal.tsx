import "./styles/NavModal.css";
import { useContext, useEffect, useState } from "react";
import SocialContext from "../context/SocialContext";
import MatchupFeed from "./MatchupFeed";
import NavFooter from "./NavFooter";
import NavHeader from "./NavHeader";
import NavFriends from "./NavFriends";
import NavCommunity from "./NavCommunity";
import { animated } from "react-spring";

interface Props {
  currentDisplay: string;
  style: any;
}

const NavModal = ({ currentDisplay, style }: Props) => {
  const { user } = useContext(SocialContext);
  // const [currentDisplay, setCurrentDisplay] = useState("My Feed");
  const centerDisplay = {
    matchupFeed: (
      <MatchupFeed currentDisplay={currentDisplay} userID={user?.uid} />
    ),
    navFriends: <NavFriends />,
    navCommunity: <NavCommunity />,
  };
  const [pageName, setPageName] = useState<string>("matchupFeed");

  useEffect(() => {
    if (currentDisplay === "My Feed") {
      setPageName("matchupFeed");
    } else if (currentDisplay === "Friends") {
      setPageName("navFriends");
    } else if (currentDisplay === "Community") {
      setPageName("navCommunity");
    }
  }, [currentDisplay]);

  return (
    <animated.div className='NavModal'>
      <NavHeader currentDisplay={currentDisplay} />
      {centerDisplay[pageName as keyof typeof centerDisplay]}
      <NavFooter currentDisplay={currentDisplay} />
    </animated.div>
  );
};

export default NavModal;
