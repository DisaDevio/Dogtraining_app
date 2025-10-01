import { useEffect, useState } from "react";
import { useMap, type LngLat, Marker } from "react-map-gl/mapbox";

// @ts-ignore
import ripaIcon from "../../public/ripa.png";
// @ts-ignore
import orreIcon from "../../public/orre.png";
// @ts-ignore
import tjaderIcon from "../../public/tjader.png";

interface AddBirdProps {
  selectedType: "ripa" | "orre" | "tjader";
}

export const AddBird = ({ selectedType }: AddBirdProps) => {
  const [selectedPoint, setSelectedPoint] = useState<LngLat | null>(null);

  const { current: map } = useMap();

  useEffect(() => {
    if (map) {
      const clickHandler = (e: any) => {
        setSelectedPoint(e.lngLat);
      };

      map.on("click", clickHandler);

      // Clean up the event listener when the component unmounts
      return () => {
        map.off("click", clickHandler);
      };
    }
  }, [map]);

  return (
    selectedPoint && (
      <Marker longitude={selectedPoint.lng} latitude={selectedPoint.lat}>
        <div style={{ color: "blue", fontSize: "24px" }}>
          {selectedType === "ripa" && (
            <img
              src={ripaIcon}
              alt="ripa"
              style={{ width: "40px", height: "auto" }}
            />
          )}
          {selectedType === "orre" && (
            <img
              src={orreIcon}
              alt="orre"
              style={{ width: "40px", height: "auto" }}
            />
          )}
          {selectedType === "tjader" && (
            <img
              src={tjaderIcon}
              alt="tjader"
              style={{ width: "40px", height: "auto" }}
            />
          )}
        </div>
      </Marker>
    )
  );
};
