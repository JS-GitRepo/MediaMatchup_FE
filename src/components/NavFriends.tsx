import "./styles/NavFriends.css";
import NavFriendListForm from "./NavFriendListForm";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MatchupFeed from "./MatchupFeed";

const NavFriends = () => {
  const [displayJSX, setDisplayJSX] = useState<JSX.Element>();
  const location = useLocation();
  const pathNameEnding = location.pathname.split("/").pop();

  const navFriendListFormJSX = <NavFriendListForm />;
  const friendFeedByUID = (
    <MatchupFeed userID={pathNameEnding} currentDisplay={"Friends"} />
  );

  useEffect(() => {
    // console.log("Location Pathname Changed To: ", pathNameEnding);
    if (pathNameEnding != "friends" && pathNameEnding != "My Feed") {
      setDisplayJSX(friendFeedByUID);
    } else if (pathNameEnding === "friends") {
      setDisplayJSX(navFriendListFormJSX);
    }
  }, [location]);

  return <div className='NavFriends'>{displayJSX}</div>;
};

export default NavFriends;
