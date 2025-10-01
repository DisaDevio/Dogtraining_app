import { useState, useEffect } from "react";

interface Activity {
  activityId: number;
  activityName: string;
  distance: number;
  duration: number;
  averageSpeed: number;
  calories: number;
  startTimeLocal: string;
}

const Hunts = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/activities")
      .then((response) => response.json())
      .then((data) => setActivities(data));
  }, []);

  return (
    <div>
      <h2 style={{ color: "white", marginBottom: "20px" }}>Alla Aktiviteter</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "rgba(255, 255, 255, 0)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "rgba(87, 91, 58, 0.8)" }}>
            <th style={{ padding: "12px", color: "white", textAlign: "left" }}>
              Namn
            </th>
            <th style={{ padding: "12px", color: "white", textAlign: "left" }}>
              Distans (km)
            </th>
            <th style={{ padding: "12px", color: "white", textAlign: "left" }}>
              Varaktighet (min)
            </th>
            <th style={{ padding: "12px", color: "white", textAlign: "left" }}>
              Genomsnittlig Hastighet (min/km)
            </th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr
              key={activity.activityId}
              style={{
                backgroundColor:
                  index % 2 === 0
                    ? "rgba(243, 173, 88, 0.55)"
                    : "rgba(121, 122, 102, 0.33)",
              }}
            >
              <td style={{ padding: "10px", color: "#333" }}>
                {activity.activityName}
              </td>
              <td style={{ padding: "10px", color: "#333" }}>
                {(activity.distance / 1000).toFixed(2)}
              </td>
              <td style={{ padding: "10px", color: "#333" }}>
                {(activity.duration / 60).toFixed(2)}
              </td>
              <td style={{ padding: "10px", color: "#333" }}>
                {(activity.averageSpeed * 3.6).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Hunts;
