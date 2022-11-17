import { useContext } from "react";
import { Link } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import "./styles/NavHeader.css";

interface Props {
  currentTitle: string;
}

const NavHeader = ({ currentTitle }: Props) => {
  const { isFriendFeed, setIsFriendFeed } = useContext(SocialContext);

  return (
    <div className='NavHeader'>
      {isFriendFeed ? (
        <Link
          className='left-nav'
          to={`/nav/friends`}
          onClick={() => setIsFriendFeed(false)}>
          <span className='material-icons'>chevron_left</span>
        </Link>
      ) : (
        ""
      )}
      <p>{currentTitle}</p>
    </div>
  );
};

export default NavHeader;
