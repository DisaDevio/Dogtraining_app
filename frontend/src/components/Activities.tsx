import { Routes, Route, Link } from "react-router-dom";
import Graphs from "./Graphs";
import Hunts from "./Hunts";
import LearningCurve from "./LearningCurve";
import "../App.css";
import Overview from "./Overview";
import "../../public/hertha-figure.png";

import Mapcomponent from "./Map";

const Activities = () => {
  return (
    <div
      className="image-container"
      style={{
        marginTop: "20px",
        width: "700px",
        border: "1px solid #ccc",
        borderRadius: "40px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
        position: "relative",
        height: "700px",
        display: "flex",
      }}
    >
      <img
        className="img"
        src="/background.png"
        alt="Hertha running"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "10px",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          width: "100%",
          backgroundColor: "rgba(87, 91, 58, 0.9)",
          borderRadius: "20px",
          margin: "20px",
        }}
      >
        <div
          style={{
            width: "200px",
            padding: "20px",
            minWidth: "200px",
            borderRight: "1px solid rgba(255,255,255,0.3)",
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: "20px 0 0 20px",
            zIndex: 3,
          }}
        >
          <h1 style={{ marginBottom: "10px" }}>Meny</h1>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link to="/">Hem</Link>
            </li>
            <li>
              <Link to="/jaktdagbok">Översikt</Link>
            </li>
            <li>
              <Link to="/jaktdagbok/graphs">Diagram</Link>
            </li>
            <li>
              <Link to="/jaktdagbok/hunts">Jakttillfällen</Link>
            </li>
            <li>
              <Link to="/jaktdagbok/learning-curve">Lärmoment</Link>
            </li>
            <li style={{ marginBottom: "20px", zIndex: 3 }}>
              <Link to="/jaktdagbok/map">Viltkarta</Link>
            </li>
          </ul>
          <div
            style={{
              position: "relative",
              bottom: "0px",
              left: "0px",
              marginTop: "90px",
              flexDirection: "row",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginLeft: "-100px",

              zIndex: 1,
            }}
          >
            <img
              src="../../public/hertha-figure.png"
              alt="Hertha"
              style={{
                scale: "0.4",

                opacity: 0.9,
                zIndex: 2,
                backgroundColor: "rgba(255, 255, 255, 0)",
              }}
            />
            <img
              src="../../public/husse-figure.png"
              alt="Husse"
              style={{
                scale: "0.5",
                left: 0,
                opacity: 0.8,
                zIndex: 1,
                marginLeft: "-120px",
              }}
            />
          </div>
        </div>
        <div
          style={{
            flexGrow: 1,
            padding: "10px",
            zIndex: 4,

            overflow: "auto",
          }}
        >
          <Routes>
            <Route index element={<Overview />} />
            <Route path="graphs" element={<Graphs />} />
            <Route path="hunts" element={<Hunts />} />
            <Route path="learning-curve" element={<LearningCurve />} />
            <Route path="map" element={<Mapcomponent />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Activities;
