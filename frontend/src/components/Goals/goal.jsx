import React, { useEffect, useState } from "react";
import axios from "axios";
import "./goal.css";
import AddGoal from "./addGoal";
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

export default function Goals() {
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchGoals = () => {
    if (!user?.id) return;
    axios
      .get(`http://localhost:3001/goals/user/${user.id}`)
      .then((res) => setGoals(res.data || []))
      .catch((err) => console.error("Fetch goals error:", err));
  };

  useEffect(() => {
    fetchGoals();
  }, [user?.id]);

  // --- DELETE LOGIC ---
  const handleDelete = (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      axios
        .delete(`http://localhost:3001/goals/${goalId}`)
        .then(() => {
          fetchGoals();
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  const totalGoals = goals.length;
  const completed = goals.filter(
    (g) => Number(g.progress) >= Number(g.target),
  ).length;
  const ongoing = goals.filter(
    (g) => Number(g.progress) > 0 && Number(g.progress) < Number(g.target),
  ).length;
  const pending = goals.filter(
    (g) => !g.progress || Number(g.progress) === 0,
  ).length;

  const displayedGoals = showCompleted
    ? goals
    : goals.filter((g) => Number(g.progress) < Number(g.target));

  if (!user) return <p style={{ padding: "20px" }}>Please login again</p>;

  const Calories = goals.filter((g) => g.type === "Calories");
  const Workouts = goals.filter((g) => g.type === "Workout");

  // Chart Data 
  const WorkoutsLineData = {
    labels: Workouts.map((g) => g.title),
    datasets: [
      {
        label: "Workouts",
        data: Workouts.map((g) =>
          Math.min(Number(g.progress), Number(g.target)),
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(54, 162, 235)",
      },
    ],
  };

  const CaloriesLineData = {
    labels: Calories.map((c) => c.title),
    datasets: [
      {
        label: "Calories Burned",
        data: Calories.map((c) => c.totalCalories),
        borderColor: "rgba(235, 45, 45, 1)",
        backgroundColor: "rgba(235, 45, 45, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="main">
      <div className="goals-page">
        <div className="goals-header">
          <h1>Goal & Progress</h1>
          <button className="add-goal" onClick={() => setShowModal(true)}>
            + Create New Goal
          </button>
        </div>

        <div className="goal-cards">
          <div className="goal-card">
            <h3>Total Goals</h3>
            <span>{totalGoals}</span>
          </div>
          <div className="goal-card green">
            <h3>Completed</h3>
            <span>{completed}</span>
          </div>
          <div className="goal-card blue">
            <h3>On-going</h3>
            <span>{ongoing}</span>
          </div>
          <div className="goal-card yellow">
            <h3>Pending</h3>
            <span>{pending}</span>
          </div>
        </div>

        <div className="goal-list">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h2>My Goals</h2>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="toggle-completed-btn"
            >
              {showCompleted ? "Hide Completed" : "Show Completed"}
            </button>
          </div>

          {displayedGoals.map((g) => {
            const target = Number(g.target) || 1;
            const displayProgress = Math.min(Number(g.progress) || 0, target);
            const percent = Math.round((displayProgress / target) * 100);

  
            const isOld =
              (new Date() - new Date(g.createdAt)) / (1000 * 60 * 60 * 24) > 7;
            let status =
              percent === 100 ? "Completed" : isOld ? "Incomplete" : "On-going";

            return (
              <div
                className="goal-item"
                key={g.id}
                onClick={() => handleDelete(g.id)} 
                style={{ cursor: "pointer" }}
              >
                <div className="goal-top">
                  <h3>{g.title}</h3>
                  <span
                    className={`status ${status.toLowerCase().replace(" ", "")}`}
                  >
                    {status}
                  </span>
                </div>
                <p className="goal-meta">
                  {displayProgress} / {target} {g.unit}
                </p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: status === "Incomplete" ? "#ff4d4d" : "",
                    }}
                  />
                </div>
                <span className="percent">{percent}%</span>
              </div>
            );
          })}
        </div>

        <div className="progress">
          <div className="cal-chart">
            <Line data={CaloriesLineData} />
          </div>
          <div className="work-chart">
            <Bar data={WorkoutsLineData} />
          </div>
        </div>
      </div>

      {showModal && (
        <AddGoal
          userId={user.id}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchGoals();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
