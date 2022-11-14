import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useTransition, animated } from "react-spring";
import "./App.css";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Homepage from "./components/Homepage";
import NavPage from "./components/NavPage";

function App() {
  // const location = useLocation();
  // const homeToNavTrans = useTransition(location, {});

  return (
    <div className='App'>
      <Router>
        <AnimatedRoutes />
        <Routes>
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
      </Router>
    </div>
  );
}

export default App;
