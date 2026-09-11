import React, { useEffect, useState } from "react";
import "./analysis.css";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

export default function Analysis() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [Cal, setCal] = useState([]);
  const [Work, setWork] = useState([]);
  const [dailySteps, setDailySteps] = useState([]);
  const [weeklySteps, setWeeklySteps] = useState([]);
  const [viewMode, setViewMode] = useState("daily");

  // ✅ Monday-based week start
  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon...
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  const filterThisWeek = (data) => {
    const startOfWeek = getStartOfWeek();
    return data.filter((item) => new Date(item.date) >= startOfWeek);
  };

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:3001/calories/${user.id}`)
      .then((res) => {
        setCal(filterThisWeek(res.data));
      })
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:3001/workouts/${user.id}`)
      .then((res) => {
        setWork(filterThisWeek(res.data));
      })
      .catch((err) => console.log(err));

    fetchStepsData();
  }, [user]);

  const fetchStepsData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/steps/all/${user.id}`,
      );
      const stepsData = response.data;

      // Last 7 days
      const dailyData = stepsData.slice(-7).map((s) => ({
        date: s.date,
        steps: s.step || 0,
      }));
      setDailySteps(dailyData);

      // Weekly (Monday based)
      const weekMap = {};
      stepsData.forEach((item) => {
        const d = new Date(item.date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        const weekKey = monday.toISOString().split("T")[0];

        if (!weekMap[weekKey]) weekMap[weekKey] = 0;
        weekMap[weekKey] += item.step || 0;
      });

      const weeklyData = Object.keys(weekMap)
        .sort()
        .map((weekStart, index) => ({
          label: `Week ${index + 1}`,
          steps: weekMap[weekStart],
        }))
        .slice(-4);

      setWeeklySteps(weeklyData);
    } catch (err) {
      console.error(err);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { boxWidth: 10, font: { size: 12 } },
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="main">
      <div className="analysis">
        <div className="analys-head">
          <h1>Analysis</h1>
          <span>Your Fitness Progress Analysis</span>
        </div>

        <div className="view-toggle">
          <button
            className="toggle-btn"
            style={{
              background: viewMode === "daily" ? "#4caf50" : "#e0e0e0",
              color: viewMode === "daily" ? "white" : "#333",
            }}
            onClick={() => setViewMode("daily")}
          >
            📅 Daily Steps
          </button>

          <button
            className="toggle-btn"
            style={{
              background: viewMode === "weekly" ? "#4caf50" : "#e0e0e0",
              color: viewMode === "weekly" ? "white" : "#333",
            }}
            onClick={() => setViewMode("weekly")}
          >
            📊 Weekly Steps
          </button>
        </div>

        <div className="analys-card">
          {/* Steps */}
          <div className="cal-card">
            <h1>
              {viewMode === "daily"
                ? "Daily Steps (Last 7 Days)"
                : "Weekly Steps (Last 4 Weeks)"}
            </h1>
            <div style={{ height: "250px" }}>
              {viewMode === "daily" ? (
                <Bar
                  data={{
                    labels: dailySteps.map((d) =>
                      new Date(d.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                    ),
                    datasets: [
                      {
                        label: "Steps",
                        data: dailySteps.map((d) => d.steps),
                        backgroundColor: "#668fff",
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              ) : (
                <Bar
                  data={{
                    labels: weeklySteps.map((w) => w.label),
                    datasets: [
                      {
                        label: "Steps",
                        data: weeklySteps.map((w) => w.steps),
                        backgroundColor: "#668fff",
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              )}
            </div>
          </div>

          <div className="cal-card">
            <h1>Calories Burned (This Week)</h1>
            <div style={{ height: "250px" }}>
              {/*Calories*/}
              <Line
                data={{
                  labels: Cal.map((c) =>
                    new Date(c.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    }),
                  ),
                  datasets: [
                    {
                      label: "Calories",
                      data: Cal.map((c) => c.totalCalories),
                      borderColor: "#eb2d2d",
                      backgroundColor: "rgba(235,45,45,0.2)",
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Workouts */}
          <div className="work-card">
            <h1>Workouts Duration (This Week)</h1>
            <div style={{ height: "250px" }}>
              <Bar
                data={{
                  labels: Work.map((w) => w.type),
                  datasets: [
                    {
                      label: "Minutes",
                      data: Work.map((w) => w.duration),
                      backgroundColor: "#36a2eb",
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
