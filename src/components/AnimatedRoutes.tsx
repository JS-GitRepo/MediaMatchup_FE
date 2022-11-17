import { Route, Routes, useLocation } from "react-router-dom";
import { animated, useTransition } from "@react-spring/web";
import Homeview from "./Homeview";
import NavModal from "./NavModal";

const AnimatedRoutes = () => {
  const location = useLocation();
  const navTransition = useTransition(location, {
    from: { transform: "translateY(100%)" },
    enter: { transform: "translateY(0%)" },
    leave: { transform: "translateY(-100%)" },
    exitBeforeEnter: false,
  });

  return navTransition((style, item) => (
    <animated.div style={style} className={"full-h-w"}>
      <Routes location={item}>
        <Route
          path='/'
          element={<Homeview style={style} currentDisplay={"My Feed"} />}
        />
        <Route
          path='/nav/My Feed'
          element={<NavModal style={style} currentDisplay='My Feed' />}
        />
        <Route
          path='/nav/friends'
          element={<NavModal currentDisplay='Friends' style={undefined} />}
        />
        <Route
          path='/nav/friends/:id'
          element={<NavModal currentDisplay='Friends' style={undefined} />}
        />
        <Route
          path='/nav/community'
          element={<NavModal currentDisplay='Community' style={undefined} />}
        />
      </Routes>
    </animated.div>
  ));
};

export default AnimatedRoutes;
