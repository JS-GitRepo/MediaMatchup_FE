import "./styles/NavMenu.css";
import GenerateMatchupIcon from "../media/navIcons/GenerateMatchupIcon.png";
import commentsIcon from "../media/navIcons/commentsIcon.png";
import generateIcon from "../media/navIcons/generateIcon.png";
import navIcon from "../media/navIcons/navIcon.png";
import shareIcon from "../media/navIcons/shareIcon.png";
import { animated, useSpring } from "@react-spring/web";

interface Props {
  navMenuTransition: () => void;
  generateMatchupButtonHandler: () => void;
  showGenerateButton: boolean;
  toggleGenAnim: boolean;
}

const NavMenu = ({
  navMenuTransition,
  generateMatchupButtonHandler,
  showGenerateButton,
  toggleGenAnim,
}: Props) => {
  const [generateAnim] = useSpring(
    () => ({
      from: {
        transform: "rotate(0deg)",
      },
      to: {
        transform: "rotate(180deg)",
      },
      reset: true,
      config: { mass: 1, tension: 170, friction: 26 },
    }),
    [toggleGenAnim]
  );
  const [diceAnim] = useSpring(
    () => ({
      from: {
        transform: "rotate(0deg)",
      },
      to: {
        transform: "rotate(-10deg)",
      },
      reset: true,
      config: { mass: 1, tension: 170, friction: 26 },
    }),
    [toggleGenAnim]
  );
  return (
    <>
      {showGenerateButton ? (
        <button
          className='generate-matchup-btn'
          onClick={generateMatchupButtonHandler}>
          <animated.img
            className='generate-matchup-img'
            style={diceAnim}
            src={generateIcon}
            alt='generate-matchup-img'
          />
          <animated.img
            className='refresh-anim'
            style={generateAnim}
            src={GenerateMatchupIcon}
            alt='generate'
          />
        </button>
      ) : (
        ""
      )}

      <div className='NavMenu nav-menu'>
        <ul>
          <li>
            <button>
              <img className='shareIcon' src={shareIcon} alt='share' />
            </button>
          </li>
          <li>
            <button>
              <img className='commentsIcon' src={commentsIcon} alt='comments' />
            </button>
          </li>
          <li>
            <button onClick={navMenuTransition}>
              <img className='navIcon' src={navIcon} alt='nav menu' />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default NavMenu;
