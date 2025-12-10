import { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import Pin from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import "../../styles/App.css";
import accessTokenData from "../auth/accessToken.json";

// @ts-ignore
import ripaIcon from "/ripa.png";
// @ts-ignore
import orreIcon from "/orre.png";
// @ts-ignore
import tjaderIcon from "/tjader.png";

const MAPBOX_TOKEN = accessTokenData.accessToken;
const MapComponent = () => {
  const [viewState, setViewState] = useState({
    longitude: 15.0686,
    latitude: 62.3293,
    zoom: 4,
  });

  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/birds")
      .then((response) => response.json())
      .then((data) => {
        const features = data.features.map((feature: any) => ({
          name: feature.properties.type,
          coordinates: feature.geometry.coordinates,
          type: feature.properties.type,
        }));
        setPoints(features);
      });
  }, []);

  const [selectedType, setSelectedType] = useState<"ripa" | "orre" | "tjader">(
    "ripa"
  );

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
            >
              <Pin>
                <svg
                  display="block"
                  height="40px"
                  width="30px"
                  viewBox="0 0 27 41"
                >
                  <path
                    fill="#c67143d6"
                    d="M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z"
                  ></path>

                  <path
                    opacity="0.25"
                    d="M13.5,0C6.04,0 0,6.04 0,13.5C0,19.22 6.75,27 12.25,34.5C13,35.52 14.02,35.5 14.75,34.5C20.25,27 27,19.07 27,13.5C27,6.04 20.96,0 13.5,0ZM13.5,1C20.42,1 26,6.58 26,13.5C26,15.9 24.5,19.18 22.22,22.74C19.95,26.3 16.71,30.14 13.94,33.91C13.74,34.18 13.61,34.32 13.5,34.44C13.39,34.32 13.26,34.18 13.06,33.91C10.28,30.13 7.41,26.31 5.02,22.77C2.62,19.23 1,15.95 1,13.5C1,6.58 6.58,1 13.5,1Z"
                  ></path>

                  <circle fill="white" cx="13.5" cy="13.5" r="10"></circle>

                  <image
                    href={
                      point.type === "ripa"
                        ? ripaIcon
                        : point.type === "orre"
                        ? orreIcon
                        : tjaderIcon
                    }
                    x="2"
                    y="0"
                    height="28"
                    width="28"
                  />
                </svg>
              </Pin>
            </Marker>
          ))}
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
          className={`map-button ${
            selectedType === "ripa" ? "active-button" : ""
          }`}
        >
          Ripa
          <img src={ripaIcon} className="button-icon" alt="ripa icon" />
        </button>
        <button
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
