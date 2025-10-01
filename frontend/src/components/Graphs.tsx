import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Activity {
  activityId: number;
  activityName: string;
  distance: number;
  duration: number;
  averageSpeed: number;
  calories: number;
  startTimeLocal: string;
}

const Graphs = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/activities")
      .then((response) => response.json())
      .then((data) => setActivities(data));
  }, []);

  const chartData = {
    labels: activities.map((activity) =>
      new Date(activity.startTimeLocal).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Distans (km)",
        data: activities.map((activity) => activity.distance / 1000),
        borderColor: "#2e421fff",
        fill: false,
      },
    ],
  };

  const durationChartData = {
    labels: activities.map((activity) =>
      new Date(activity.startTimeLocal).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Tid (min)",
        data: activities.map((activity) => activity.duration / 60),
        borderColor: "#d27926ff",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2 style={{ color: "white", marginBottom: "20px" }}>Diagram</h2>
      <div
        style={{
          width: "90%",
          margin: "auto",
          marginBottom: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            color: "white",
            scales: {
              x: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.3)" },
              },
              y: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.3)" },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "white",
                },
              },
            },
          }}
        />
      </div>

      <div
        style={{
          width: "90%",
          margin: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <Line
          data={durationChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            color: "white",
            scales: {
              x: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.3)" },
              },
              y: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.3)" },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "white",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Graphs;
