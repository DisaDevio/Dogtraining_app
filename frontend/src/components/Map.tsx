import { useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import "../App.css";

// @ts-ignore
import ripaIcon from "../../public/ripa.png";
// @ts-ignore
import orreIcon from "../../public/orre.png";
// @ts-ignore
import tjaderIcon from "../../public/tjader.png";
import { AddBird } from "./AddBird";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZGlzZGlzZGlzIiwiYSI6ImNtZzZtcmY4cDBjZzgyaXIycG03aDB1YnIifQ.3XCMUZ14xUztho4Gl1I4CQ";

const MapComponent = () => {
  const [viewState, setViewState] = useState({
    longitude: 15.0686,
    latitude: 62.3293,
    zoom: 4,
  });

  const points = [
    { name: "Point A", coordinates: [18.0686, 59.3293], type: "ripa" },
    { name: "Point B", coordinates: [18.1, 59.35], type: "orre" },
    { name: "Point C", coordinates: [18.05, 59.3], type: "tjader" },
  ];
  const [selectedType, setSelectedType] = useState<"ripa" | "orre" | "tjader">(
    "ripa"
  );
  const clickSave = () => {
    // Implement save functionality here
    console.log("Save button clicked");
  };

  return (
    <div
      style={{
        width: "90%",
        margin: "auto",
        backgroundColor: "rgba(255, 255, 255, 0)",
        padding: "15px",
        borderRadius: "8px",
        minHeight: "500px",
      }}
    >
      <h1
        style={{
          color: "white",
          marginBottom: "2px",
          fontSize: "30px",
          marginTop: "-10px",
        }}
      >
        Viltkarta
      </h1>
      <div style={{ height: "500px", width: "100%" }}>
        <Map
          {...viewState}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          mapboxAccessToken={MAPBOX_TOKEN}
          interactive={true}
          onMove={(evt) => setViewState(evt.viewState)}
        >
          {points.map((point, index) => (
            <Marker
              key={`marker-${index}`}
              longitude={point.coordinates[0]}
              latitude={point.coordinates[1]}
              style={{ border: "white" }}
            >
              <div style={{ color: "red", fontSize: "24px" }}>
                {point.type === "ripa" && (
                  <img
                    src={ripaIcon}
                    alt="ripa"
                    style={{ width: "60px", height: "auto" }}
                  />
                )}
                {point.type === "orre" && (
                  <img
                    src={orreIcon}
                    alt="orre"
                    style={{ width: "40px", height: "auto" }}
                  />
                )}
                {point.type === "tjader" && (
                  <img
                    src={tjaderIcon}
                    alt="tjader"
                    style={{ width: "40px", height: "auto" }}
                  />
                )}
              </div>
            </Marker>
          ))}
          <AddBird selectedType={selectedType} />
          <button
            onClick={clickSave}
            className="button"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1,
              padding: "10px",
            }}
          >
            Spara
          </button>
        </Map>
      </div>
      <div
        style={{
          color: "white",
          marginTop: "10px",
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => setSelectedType("ripa")}
          className={`map-button ${
            selectedType === "ripa" ? "active-button" : ""
          }`}
        >
          Ripa
          <img src={ripaIcon} className="button-icon" alt="ripa icon" />
        </button>
        <button
          onClick={() => setSelectedType("orre")}
          className={`map-button ${
            selectedType === "orre" ? "active-button" : ""
          }`}
        >
          Orre
          <img src={orreIcon} className="button-icon" alt="orre icon" />
        </button>
        <button
          onClick={() => setSelectedType("tjader")}
          className={`map-button ${
            selectedType === "tjader" ? "active-button" : ""
          }`}
        >
          Tjäder
          <img src={tjaderIcon} className="button-icon" alt="tjader icon" />
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
