import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AnimatedRoutes from "./components/AnimatedRoutes";

function App() {
  // const location = useLocation();
  // const homeToNavTrans = useTransition(location, {});

  return (
    <div className='App full-h-w'>
      <Router>
        <AnimatedRoutes />
      </Router>
    </div>
  );
}

export default App;
