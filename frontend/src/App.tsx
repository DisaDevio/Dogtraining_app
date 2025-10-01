import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Activities from "./components/Activities";
import MapComponent from "./components/Map";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jaktdagbok/*" element={<Activities />} />
          <Route path="/map" element={<MapComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
