import React, { useState } from "react";
import axios from "axios";
import "./addgoal.css";

export default function AddGoal({onClose}) {
  const [Title, setTitle] = useState("");
  const [Type, setType] = useState("Workout");
  const [Target, setTarget] = useState("");
  const [Unit, setUnit] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Title || !Type || !Target || !Unit) {
      alert("Fill all fields");
    }
    
    const newGoal = {
      title: Title,
      type: Type,
      target: Target,
      unit: Unit,
      user_id: JSON.parse(localStorage.getItem("user")).id,
    };
    axios
      .post("http://localhost:3001/goals", newGoal)
      .then((res) => {
        if (res.data.message === "Added successful") {
          let local = JSON.parse(localStorage.getItem("goals")) || [];
          local.push(newGoal);
          localStorage.setItem("goals", JSON.stringify(local));
          alert("Goal Added!");
          onClose(true);
        } else {
          alert("Not Added!");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="goal-overlay">
      <div className="goal">
        <h2>Create New Goal 🎯</h2>

        <input
          placeholder="Goal title"
          value={Title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select value={Type} onChange={(e) => setType(e.target.value)}>
          <option>Workout</option>
          <option>Calories</option>
          <option>Steps</option>
          <option>Weight</option>
        </select>

        <input
          type="number"
          placeholder="Target value"
          value={Target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <input
          placeholder="Unit (eg: workouts, kcal, steps)"
          value={Unit}
          onChange={(e) => setUnit(e.target.value)}
        />

        <div className="goal-actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="save" onClick={handleSubmit}>
            Save Goal
          </button>
        </div>
      </div>
    </div>
  );
}
