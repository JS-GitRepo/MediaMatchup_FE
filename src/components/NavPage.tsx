import "./styles/NavPage.css";
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

const NavPage = ({ currentDisplay, style }: Props) => {
  const { user } = useContext(SocialContext);
  const [centerDisplayJSX, setCenterDisplayJSX] = useState<JSX.Element>(
    <MatchupFeed currentDisplay={currentDisplay} userID={user?.uid} />
  );

  const matchupFeedJSX = (
    <MatchupFeed currentDisplay={currentDisplay} userID={user?.uid} />
  );
  const navFriendsJSX = <NavFriends />;
  const navCommunityJSX = <NavCommunity />;

  useEffect(() => {
    if (currentDisplay === "My Feed") {
      setCenterDisplayJSX(matchupFeedJSX);
    } else if (currentDisplay === "Friends") {
      setCenterDisplayJSX(navFriendsJSX);
    } else if (currentDisplay === "Community") {
      setCenterDisplayJSX(navCommunityJSX);
    }
  }, [currentDisplay]);

  return (
    <animated.div className='NavPage'>
      <NavHeader currentDisplay={currentDisplay} />
      {centerDisplayJSX}
      <NavFooter currentDisplay={currentDisplay} />
    </animated.div>
  );
};

export default NavPage;
