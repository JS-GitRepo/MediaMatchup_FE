import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Homeview from "./components/Homeview";

function App() {
  return (
    <div className='App full-h-w'>
      <Router>
        <Routes>
          <Route
            path='/'
            element={<Homeview style={undefined} currentDisplay={"My Feed"} />}
          />
          <Route
            path='/nav/myfeed'
            element={<Homeview style={undefined} currentDisplay={"My Feed"} />}
          />
          <Route
            path='/nav/friends'
            element={<Homeview style={undefined} currentDisplay={"Friends"} />}
          />
          <Route
            path='/nav/friends/:id'
            element={<Homeview style={undefined} currentDisplay={"Friends"} />}
          />
          <Route
            path='/nav/community'
            element={
              <Homeview style={undefined} currentDisplay={"Community"} />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
