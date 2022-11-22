import "./styles/NavFooter.css";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import { signInWithGoogle, signOut } from "../firebaseConfig";
import chevron from "../media/wide_chevron.png";

interface Props {
  currentDisplay: string;
}

const NavFooter = ({ currentDisplay }: Props) => {
  const { user } = useContext(SocialContext);
  const navigate = useNavigate();

  const handleLeftNav = () => {
    if (currentDisplay === "My Feed") {
      return "/nav/community";
    } else if (currentDisplay === "Friends") {
      return "/nav/myfeed";
    } else {
      return "";
    }
  };
  const handleRightNav = () => {
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
            <Link className='left-nav angle-btns' to={handleLeftNav()}>
              <span className='material-icons'>chevron_left</span>
            </Link>
          ) : (
            <></>
          )}
          {currentDisplay}
          {currentDisplay === "My Feed" || currentDisplay === "Community" ? (
            <Link className='right-nav angle-btns' to={handleRightNav()}>
              <span className='material-icons'>chevron_right</span>
            </Link>
          ) : (
            <></>
          )}
        </p>
      </div>
      {/* <p>{user.email}</p> */}
      <div className='buttons-container'>
        <button
          className='signout button'
          onClick={() => {
            signOut();
            navigate("/");
          }}>
          SignOut
        </button>
      </div>
      <img
        className='return-chevron'
        onClick={() => navigate("/")}
        src={chevron}
        alt="'return' navigation icon"
      />
    </div>
  );
};

export default NavFooter;
