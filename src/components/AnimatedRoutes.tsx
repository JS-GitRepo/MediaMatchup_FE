import { Route, Routes, useLocation } from "react-router-dom";
import { animated, useTransition } from "react-spring";
import Homepage from "./Homepage";
import NavPage from "./NavPage";

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
        <Route path='/' element={<Homepage style={style} />} />
        <Route
          path='/nav/myfeed'
          element={<NavPage style={style} currentDisplay='My Feed' />}
        />
        <Route
          path='/nav/friends'
          element={<NavPage currentDisplay='Friends' style={undefined} />}
        />
        <Route
          path='/nav/friends/:id'
          element={<NavPage currentDisplay='Friends' style={undefined} />}
        />
        <Route
          path='/nav/community'
          element={<NavPage currentDisplay='Community' style={undefined} />}
        />
      </Routes>
    </animated.div>
  ));
};

export default AnimatedRoutes;
