import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Overview from "./components/pages/Overview";
import Graphs from "./components/pages/Graphs";
import Hunts from "./components/pages/Hunts";
import LearningCurve from "./components/pages/LearningCurve";
import MapComponent from "./components/pages/Map";
import ActivityDetails from "./components/pages/ActivityDetails";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Router>
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/jaktdagbok"
            element={
              <Layout>
                <Overview />
              </Layout>
            }
          />
          <Route
            path="/jaktdagbok/graphs"
            element={
              <Layout>
                <Graphs />
              </Layout>
            }
          />
          <Route
            path="/jaktdagbok/hunts"
            element={
              <Layout>
                <Hunts />
              </Layout>
            }
          />
          <Route
            path="/jaktdagbok/learning-curve"
            element={
              <Layout>
                <LearningCurve />
              </Layout>
            }
          />
          <Route
            path="/jaktdagbok/map"
            element={
              <Layout>
                <MapComponent />
              </Layout>
            }
          />
          <Route path="/activity/:id" element={<ActivityDetails />} />
        </Routes>
      </ProtectedRoute>
    </Router>
  );
}

export default App;
