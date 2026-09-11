import React, { useEffect, useState } from "react";
import "./workout.css";
import AddWorkout from "./AddWorkout";
import axios from "axios";

export default function Workout() {
  const [open, setOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:3001/workouts/${user.id}`)
      .then((res) => {
        const sorted = (res.data || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        setWorkouts(sorted);
      })
      .catch((err) => console.log(err));
  }, [user?.id]);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyWorkouts = workouts.filter(
    (w) => new Date(w.date) >= startOfWeek,
  );
  const totalWorkouts = weeklyWorkouts.length;
  const totalDuration = weeklyWorkouts.reduce(
    (sum, w) => sum + Number(w.duration || 0),
    0,
  );
  const totalCalories = weeklyWorkouts.reduce(
    (sum, w) => sum + Number(w.calories || 0),
    0,
  );
  const avgDuration =
    totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;


    const handleDelete = (id) => {
      if (window.confirm("Are you sure you want to delete this workout?")) {
        axios
          .delete(`http://localhost:3001/workouts/${id}`)
          .then(() => {
            alert("Workout deleted successfully.");
            setWorkouts(workouts.filter((workout) => workout.id !== id));
          })
          .catch((err) => console.log(err));
      }
    };


  return (
    <div className="main">
      <div className="workout_main">
        <div className="workout_head">
          <div className="workout_h1">
            <h1>Workout</h1>
            <h4>Track your workouts and monitor your performance</h4>
          </div>
          <div className="work-btn">
            <button onClick={() => setOpen(true)}>+ Add Workout</button>
          </div>
          <AddWorkout isopen={open} onclose={() => setOpen(false)} />
        </div>

        <div className="workout_card">
          <div className="workout_card1">
            <div className="workout_head1">
              <h2>This Week</h2>
              <h3>{totalWorkouts}</h3>
              <h3>workouts</h3>
            </div>
          </div>
          <div className="workout_card2">
            <div className="workout_head1">
              <h2>Total Duration</h2>
              <h3>{totalDuration}⏱️</h3>
              <h3>Minutes</h3>
            </div>
          </div>
          <div className="workout_card3">
            <div className="workout_head1">
              <h2>Total Calories</h2>
              <h3>{totalCalories}</h3>
              <h3>Burned</h3>
            </div>
          </div>
          <div className="workout_card4">
            <div className="workout_head1">
              <h2>Avg.Duration</h2>
              <h3>{avgDuration}</h3>
              <h3>Minutes</h3>
            </div>
          </div>
        </div>

        <div className="workout_body">
          <div className="workout_body1">
            <div className="recent">
              <h1>Recent Workouts</h1>
              <h4>Your recent workout sessions and performance metrics</h4>
            </div>

            {workouts.length === 0 && (
              <p style={{ padding: "20px" }}>No workouts found</p>
            )}

            {workouts.slice(0, 5).map((workout, index) => (
              <ul key={index}>
                <div className="list" onClick={() => handleDelete(workout.id)}>
                  <li className="li1">
                    <span className="sp">{workout.type}</span>
                    <span
                      className={workout.intensity?.toLowerCase() || "moderate"}
                    >
                      {workout.intensity}
                    </span>
                  </li>
                  <li className="li2">
                    <span>⏱️ {workout.duration} min</span>
                    <span>🔥 {workout.calories} kcal</span>
                    <span>
                      📆 {new Date(workout.date).toLocaleDateString()}
                    </span>
                  </li>
                </div>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
