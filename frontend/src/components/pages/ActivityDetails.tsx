import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/ActivityDetails.css";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import type {
  LineLayerSpecification,
  LngLat,
  MapRef,
} from "react-map-gl/mapbox";
import accessTokenData from "../auth/accessToken.json";
import Pin from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { centroid } from "@turf/turf";
// @ts-ignore
import ripaIcon from "/ripa.png";
// @ts-ignore
import orreIcon from "/orre.png";
// @ts-ignore
import tjaderIcon from "/tjader.png";
import { AddBird } from "../../hooks/AddBird";

type Activity = {
  Namn: string;
  "Distans (m)": number;
  Varaktighet: string | number;

  Tid: string | number;
  "Höjdmeter upp/ned (m)": string | number;

  [key: string]: string | number; // Allow string indexing
};
const detailslist = [
  "Distans (m)",
  "Varaktighet",
  "Tid",
  "Höjdmeter upp/ned (m)",
];

const ActivityDetails = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState<Activity>({
    Namn: "Aktivitet",
    "Distans (m)": 0,
    Varaktighet: 0,

    Tid: 0,
    "Höjdmeter upp/ned (m)": 0,
  });
  const [line, setLine] = useState<any[] | null>(null);
  const [howItWent, setHowItWent] = useState("");
  const [wind, setWind] = useState("");
  const [markers, setMarkers] = useState<any[]>([]);
  const accessToken = accessTokenData.accessToken;
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        // Fetch all data concurrently but with abort signals
        const [statsResponse, routeResponse, loadResponse] = await Promise.all([
          fetch(`/api/activity/${id}/stats`, {
            signal: abortController.signal,
          }),
          fetch(`/api/activity/${id}/route`, {
            signal: abortController.signal,
          }),
          fetch(`/api/load/${id}`, { signal: abortController.signal }),
        ]);

        if (!abortController.signal.aborted) {
          const [statsData, routeData, loadData] = await Promise.all([
            statsResponse.json(),
            routeResponse.json(),
            loadResponse.json(),
          ]);

          setActivity(statsData);
          setLine(routeData.route || routeData); // Handle both old and new API format

          if (loadData && loadData.data !== "none") {
            setHowItWent(loadData.howItWent || "");
            setWind(loadData.wind || "");
            setMarkers(loadData.markers || []);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching activity data:", error);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [id]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        if (map && map.remove) {
          map.remove();
        }
      }
    };
  }, []);

  const Linespec: LineLayerSpecification = {
    id: "line-layer",
    type: "line",
    source: "line-source",
    paint: {
      "line-color": "#e17217",
      "line-width": 2,
    },
  };

  const [selectedType, setSelectedType] = useState<"ripa" | "orre" | "tjader">(
    "ripa"
  );
  const clickRegret = () => {
    if (markers.length === 0) return;
    const newMarkers = markers.slice(0, -1);
    setMarkers(newMarkers);
    console.log("Regret button clicked");
  };
  const clickSave = () => {
    fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        howItWent,
        wind,
        markers,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Data saved successfully");
        } else {
          console.error("Error saving data");
        }
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });
    console.log("Save button clicked");
  };

  const handleBirdAdded = (point: LngLat, type: "ripa" | "orre" | "tjader") => {
    const newMarker = {
      coordinates: [point.lng, point.lat],
      type: type,
    };
    setMarkers([...markers, newMarker]);
  };

  return (
    <div
      className="image-container"
      style={{
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
          <h1 style={{ marginBottom: "1px" }}>Meny</h1>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <Link to="/jaktdagbok/hunts">Tillbaka</Link>
            </li>
          </ul>
          <div
            style={{
              position: "relative",
              bottom: "0px",
              left: "0px",
              marginTop: "235px",
              flexDirection: "row",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginLeft: "-100px",

              zIndex: 1,
            }}
          >
            <img
              src="/hertha-figure.png"
              alt="Hertha"
              style={{
                scale: "0.4",

                opacity: 0.9,
                zIndex: 2,
                backgroundColor: "rgba(255, 255, 255, 0)",
              }}
            />
            <img
              src="/husse-figure.png"
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
          <h2>{activity.Namn}</h2>
          <div className="details-box">
            {detailslist.map((detail) => (
              <p key={detail}>
                <span className="label">{detail}:</span>
                <span>{activity[detail]}</span>
              </p>
            ))}
          </div>

          <div
            style={{
              marginTop: "5px",
              borderRadius: "10px",
              overflow: "hidden",
              height: "280px",
              width: "100%",
              marginBottom: "5px",
            }}
          >
            {line && (
              <Map
                ref={mapRef}
                mapboxAccessToken={accessToken}
                accessToken={accessToken}
                style={{ width: "100%", height: "400px" }}
                initialViewState={{
                  longitude: line
                    ? centroid({
                        type: "LineString",
                        coordinates: line.map((point: any) => [
                          point[1],
                          point[0],
                        ]),
                      }).geometry.coordinates[0]
                    : 18.06324,

                  latitude: line
                    ? centroid({
                        type: "LineString",
                        coordinates: line.map((point: any) => [
                          point[1],
                          point[0],
                        ]),
                      }).geometry.coordinates[1]
                    : 59.334591,
                  zoom: 11,
                }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                interactive={true}
              >
                {line && (
                  <Source
                    id="line-source"
                    type="geojson"
                    data={{
                      type: "Feature",
                      properties: {},
                      geometry: {
                        type: "LineString",
                        coordinates: line
                          ? line.map((point: any) => [point[1], point[0]])
                          : [],
                      } as any,
                    }}
                  >
                    <Layer {...Linespec} />
                  </Source>
                )}
                {markers.map((point, index) => (
                  <Marker
                    key={`marker-${index}`}
                    longitude={point.coordinates[0]}
                    latitude={point.coordinates[1]}
                  >
                    <Pin mapboxAccessToken={accessToken}>
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

                        <circle
                          fill="white"
                          cx="13.5"
                          cy="13.5"
                          r="10"
                        ></circle>

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
                <AddBird
                  selectedType={selectedType}
                  onBirdAdd={handleBirdAdded}
                />

                <button
                  onClick={clickRegret}
                  className="button"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 1,
                    padding: "10px",
                    fontSize: "12px",
                  }}
                >
                  Ångra
                </button>
              </Map>
            )}
          </div>
          <div
            style={{
              color: "white",
              marginTop: "10px",
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              flex: 1,
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

          <div className="details-box">
            <p>Hur gick det?</p>
            <textarea
              value={howItWent}
              onChange={(e) => setHowItWent(e.target.value)}
              placeholder="Beskriv hur det gick..."
              rows={4}
              style={{
                width: "95%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#e8d097ff",
                color: "darkslategray",
                height: "40px",
              }}
            />
            <p style={{ marginTop: "1px" }}>Vind:</p>
            <select
              value={wind}
              onChange={(e) => setWind(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#e8d097ff",
                color: "darkslategray",
              }}
            >
              <option value="">Välj vindstyrka</option>
              <option value="stiltje">Stiltje (0-1 m/s)</option>
              <option value="svag">Svag (1-3 m/s)</option>
              <option value="medium">Medium (3-8 m/s)</option>
              <option value="ganska_stark">Ganska stark (8-12 m/s)</option>
              <option value="valdigt_stark">Väldigt stark (12+ m/s)</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <button
              onClick={clickSave}
              className="button"
              style={{
                zIndex: 1,
                padding: "10px",
              }}
            >
              Spara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
