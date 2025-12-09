import { useEffect, useState } from "react";

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
    const abortController = new AbortController();
    
    const fetchOverview = async () => {
      try {
        const response = await fetch("/api/activities", {
          signal: abortController.signal
        });
        const result = await response.json();
        const data: Activity[] = result.activities || result; // Handle both old and new API format
        
        if (!abortController.signal.aborted) {
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
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching overview data:', error);
        }
      }
    };

    fetchOverview();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      <h2 style={{ color: "white", marginBottom: "10px" }}>Översikt</h2>
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          padding: "5px",
          borderRadius: "8px",
          color: "#333",
          fontSize: "18px",
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
        src="/hertha_husse.png"
        alt="Hertha running"
        style={{
          marginTop: "20px",
          width: "100%",
          borderRadius: "8px",
          opacity: 0.7,
          maxHeight: "600px",
          objectFit: "cover",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      />
    </div>
  );
};

export default Overview;
