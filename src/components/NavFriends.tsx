import "./styles/NavFriends.css";
import NavFriendListForm from "./NavFriendListForm";
import { SetStateAction, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MatchupFeed from "./MatchupFeed";

interface Props {
  setCurrentTitle: React.Dispatch<React.SetStateAction<string>>;
}

const NavFriends = ({ setCurrentTitle }: Props) => {
  const [displayJSX, setDisplayJSX] = useState<JSX.Element>();
  const location = useLocation();
  const pathNameEnding = location.pathname.split("/").pop();

  const navFriendListFormJSX = <NavFriendListForm />;
  const friendFeedByUID = (
    <MatchupFeed userID={pathNameEnding} setCurrentTitle={setCurrentTitle} />
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
