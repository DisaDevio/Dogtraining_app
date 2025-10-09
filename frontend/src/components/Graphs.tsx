import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
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

const getWeek = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return weekNo;
};

const Graphs = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [huntDetails, setHuntDetails] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/activities")
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
        const promises = data.map((activity: Activity) =>
          fetch(`/api/load/${activity.activityId}`).then((response) =>
            response.json()
          )
        );
        Promise.all(promises).then((details) => setHuntDetails(details));
      });
  }, []);

  const weeklyData = activities.reduce((acc, activity) => {
    const week = getWeek(new Date(activity.startTimeLocal));
    if (!acc[week]) {
      acc[week] = { distance: 0, duration: 0 };
    }
    acc[week].distance += activity.distance / 1000;
    acc[week].duration += activity.duration / 60;
    return acc;
  }, {} as { [key: number]: { distance: number; duration: number } });

  const weeklyChartData = {
    labels: Object.keys(weeklyData).map((week) => `Vecka ${week}`),
    datasets: [
      {
        label: "Distans (km) per vecka",
        data: Object.values(weeklyData).map((data) => data.distance),
        backgroundColor: "#2e421fff",
      },
    ],
  };

  const weeklyDurationChartData = {
    labels: Object.keys(weeklyData).map((week) => `Vecka ${week}`),
    datasets: [
      {
        label: "Tid (min) per vecka",
        data: Object.values(weeklyData).map((data) => data.duration),
        backgroundColor: "#d27926ff",
      },
    ],
  };

  const windData = huntDetails.reduce((acc, detail) => {
    if (detail && detail.wind) {
      acc[detail.wind] = (acc[detail.wind] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });

  const windChartData = {
    labels: Object.keys(windData),
    datasets: [
      {
        label: "Antal jakter per vindförhållande",
        data: Object.values(windData),
        backgroundColor: "#2e421fff",
      },
    ],
  };

  const birdData = huntDetails.reduce((acc, detail) => {
    if (detail && detail.markers) {
      detail.markers.forEach((marker: any) => {
        if (marker.type) {
          acc[marker.type] = (acc[marker.type] || 0) + 1;
        }
      });
    }
    return acc;
  }, {} as { [key: string]: number });

  const birdChartData = {
    labels: Object.keys(birdData),
    datasets: [
      {
        label: "Antal fåglar per art",
        data: Object.values(birdData),
        backgroundColor: "#6c4923ff",
      },
    ],
  };

  return (
    <div>
      <h2 style={{ color: "white", marginBottom: "20px" }}>Statistik</h2>
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
        <Bar
          data={weeklyChartData}
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
        <Bar
          data={weeklyDurationChartData}
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
          marginTop: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <Bar
          data={windChartData}
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
          marginTop: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <Bar
          data={birdChartData}
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
                grid: { color: "rgba(255,255,255,.3)" },
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
