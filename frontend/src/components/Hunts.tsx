import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Hunts.css";

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
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/activities")
      .then((response) => response.json())
      .then((data) => setActivities(data));
  }, []);

  const handleRowClick = (activityId: number) => {
    navigate(`/activity/${activityId}`);
  };

  return (
    <div className="hunts-container">
      <h2 style={{ color: "white", marginBottom: "20px" }}>Alla Aktiviteter</h2>
      <table>
        <thead>
          <tr>
            <th>Namn</th>
            <th>Distans (km)</th>
            <th>Varaktighet (min)</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr
              className={`activity-row-${index % 2 === 0 ? "even" : "odd"}`}
              key={activity.activityId}
              onClick={() => handleRowClick(activity.activityId)}
            >
              <td
                style={{
                  padding: "10px",
                  color: "#e2b94a",
                  textDecoration: "none",
                }}
              >
                {activity.activityName}
              </td>
              <td style={{ padding: "10px", color: "#333" }}>
                {(activity.distance / 1000).toFixed(2)}
              </td>
              <td style={{ padding: "10px", color: "#333" }}>
                {(activity.duration / 60).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Hunts;
