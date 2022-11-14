import "./styles/NavFooter.css";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import { signInWithGoogle, signOut } from "../firebaseConfig";

interface Props {
  currentDisplay: string;
}

const NavFooter = ({ currentDisplay }: Props) => {
  const { user } = useContext(SocialContext);
  const navigate = useNavigate();
  const leftNav = () => {
    if (currentDisplay === "My Feed") {
      return "/nav/community";
    } else if (currentDisplay === "Friends") {
      return "/nav/myfeed";
    } else {
      return "";
    }
  };
  const rightNav = () => {
    if (currentDisplay === "My Feed") {
      return "/nav/friends";
    } else if (currentDisplay === "Community") {
      return "/nav/myfeed";
    } else {
      return "";
    }
  };

  return (
    <div className='NavFooter'>
      <div className='nav-container'>
        <p>
          {currentDisplay === "My Feed" || currentDisplay === "Friends" ? (
            <Link className='left-nav angle-btns' to={leftNav()}>
              <span className='material-icons'>chevron_left</span>
            </Link>
          ) : (
            <div></div>
          )}
          {currentDisplay}
          {currentDisplay === "My Feed" || currentDisplay === "Community" ? (
            <Link className='right-nav angle-btns' to={rightNav()}>
              <span className='material-icons'>chevron_right</span>
            </Link>
          ) : (
            <div></div>
          )}
        </p>
      </div>
      {/* <p>{user.email}</p> */}
      <div className='buttons-container'>
        <button onClick={() => navigate("/")} className='return button'>
          Return to Matchups
        </button>
        <button
          className='signout button'
          onClick={() => {
            signOut();
            navigate("/");
          }}>
          SignOut
        </button>
      </div>
    </div>
  );
};

export default NavFooter;
