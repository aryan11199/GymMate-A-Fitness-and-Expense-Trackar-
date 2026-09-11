import React, { useState } from "react";
import axios from "axios";
import "./addworkout.css";

export default function AddWorkout({ isopen, onclose }) {
  const [Type, setType] = useState("");
  const [Intensity, setIntensity] = useState("");
  const [Duration, setDuration] = useState("");
  const [Calories, setCalories] = useState("");
  const [Date, setDate] = useState("");
  const [Note, setNote] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!Type || !Intensity || !Duration || !Calories || !Date || !Note) {
      alert("Please fill all fields.");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
      const newWorkout = {
        type: Type,
        intensity: Intensity,
        duration: Duration,
        calories: Calories,
        date: Date,
        note: Note,
        user_id: user.id,
      };

      const res = await axios.post(
        "http://localhost:3001/workouts",
        newWorkout,
      );

      if (res.status === 200 || res.status === 201) {
        let local = JSON.parse(localStorage.getItem("workouts")) || [];
        local.push(newWorkout);
        localStorage.setItem("workouts", JSON.stringify(local)); 
        onclose();
        window.location.reload(); 
        alert("Workout Added Successfully!");
      } else {
        alert("Not Added!");
      }
  };

  if (!isopen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Log New Workout</h2>
          <span className="close" onClick={onclose}>
            ×
          </span>
        </div>

        <div className="form-grid">
          <div>
            <label>Workout Type *</label>
            <select
              value={Type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select type</option>
              <option>Cardio</option>
              <option>Strength</option>
              <option>Yoga</option>
            </select>
          </div>

          <div>
            <label>Intensity</label>
            <select
              value={Intensity}
              onChange={(e) => setIntensity(e.target.value)}
              required
            >
              <option value="">Select intensity</option>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label>Duration (minutes) *</label>
            <input
              className="in"
              type="number"
              placeholder="e.g 30"
              value={Duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Calories Burned *</label>
            <input
              className="in"
              type="number"
              placeholder="e.g 350"
              value={Calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>

          <div className="full-width">
            <label>Workout Date *</label>
            <input
              className="in"
              type="date"
              value={Date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="full-width">
            <label>Notes (Optional)</label>
            <textarea placeholder="Add any note about your wrokout" value={Note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel" onClick={onclose}>
            Cancel
          </button>
          <button className="submit" onClick={handleAdd}>
            Log Workout
          </button>
        </div>
      </div>
    </div>
  );
}
