import { useEffect, useState } from "react";
import "../../public/hertha_husse.jpg";

interface Activity {
  distance: number;
  duration: number;
}

const Overview = () => {
  console.log("Rendering Overview component");
  const [summary, setSummary] = useState({
    total_activities: 0,
    total_distance: 0,
    total_duration: 0,
  });

  useEffect(() => {
    fetch("/api/activities")
      .then((response) => response.json())
      .then((data: Activity[]) => {
        const total_activities = data.length;
        const total_distance =
          data.reduce((acc, activity) => acc + activity.distance, 0) / 1000;
        const total_duration =
          data.reduce((acc, activity) => acc + activity.duration, 0) / 60;

        setSummary({
          total_activities,
          total_distance,
          total_duration,
        });
      });
  }, []);

  return (
    <div>
      <h2 style={{ color: "white", marginBottom: "20px" }}>Översikt</h2>
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          padding: "20px",
          borderRadius: "8px",
          color: "#333",
        }}
      >
        <p>
          <strong>Antal jakttillfällen:</strong> {summary.total_activities}
        </p>
        <p>
          <strong>Total sprungen sträcka:</strong>{" "}
          {summary.total_distance.toFixed(2)} km
        </p>
        <p>
          <strong>Total varaktighet:</strong>{" "}
          {summary.total_duration.toFixed(2)} min
        </p>
      </div>
      <img
        src="../../public/hertha_husse.jpg"
        alt="Hertha running"
        style={{
          marginTop: "20px",
          width: "100%",
          borderRadius: "8px",
          opacity: 0.7,
          maxHeight: "350px",
          objectFit: "cover",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
    </div>
  );
};

export default Overview;
