import { Route, Routes, useLocation } from "react-router-dom";
import { useTransition } from "react-spring";
import Homepage from "./Homepage";
import NavPage from "./NavPage";

const AnimatedRoutes = () => {
  const location = useLocation();
  const navTransition = useTransition(location, {
    to: { opacity: 1 },
    from: { opacity: 1 },
  });

  return navTransition((style, item) => (
    <Routes>
      <Route path='/' element={<Homepage style={style} />} />
      <Route
        path='/nav/myfeed'
        element={<NavPage style={style} currentDisplay='My Feed' />}
      />
    </Routes>
  ));
};

export default AnimatedRoutes;
