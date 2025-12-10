import { useEffect } from "react";
import { useMap, type LngLat } from "react-map-gl/mapbox";

interface AddBirdProps {
  selectedType: "ripa" | "orre" | "tjader";
  onBirdAdd: (point: LngLat, type: "ripa" | "orre" | "tjader") => void;
}

export const AddBird = ({ selectedType, onBirdAdd }: AddBirdProps) => {
  const { current: map } = useMap();

  useEffect(() => {
    if (map) {
      const clickHandler = (e: any) => {
        onBirdAdd(e.lngLat, selectedType);
      };

      map.on("click", clickHandler);

      // Clean up the event listener when the component unmounts
      return () => {
        map.off("click", clickHandler);
      };
    }
  }, [map, onBirdAdd, selectedType]);

  return null;
};
