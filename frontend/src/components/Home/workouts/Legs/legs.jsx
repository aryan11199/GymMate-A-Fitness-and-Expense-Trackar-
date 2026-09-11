import React from "react";
import "./legs.css";
import { useState } from "react";
import Details from "../details";
export default function Legs() {
  const [isopen, setIsOpen] = useState(false);
    const [exerciseId, setExerciseId] = useState(null);
    const openDetails = (id) => {
      setExerciseId(id);
      setIsOpen(true);
    };
  return (
    <div className="main">
      <div className="Legs-body">
        <h1>Legs Exercises</h1>
        <div className="Legs-content">
          <div id="squat" className="Legs1" onClick={() => openDetails(43)}>
            <h3>Bodyweight Squat</h3>
          </div>
          <div id="Lung" className="Legs1" onClick={() => openDetails(44)}>
            <h3>Lunges</h3>
          </div>
          <div id="curl" className="Legs1" onClick={() => openDetails(45)}>
            <h3>Leg Curl</h3>
          </div>
          <div id="barbel" className="Legs1" onClick={() => openDetails(46)}>
            <h3>Barbell Squat</h3>
          </div>
          <div id="legpress" className="Legs1" onClick={() => openDetails(47)}>
            <h3>Leg Press</h3>
          </div>
          <div id="roman" className="Legs1" onClick={() => openDetails(48)}>
            <h3>Romanian Deadlift</h3>
          </div>
          <div id="split" className="Legs1" onClick={() => openDetails(49)}>
            <h3>Bulgarian split Squat</h3>
          </div>
          <div id="Hip" className="Legs1" onClick={() => openDetails(50)}>
            <h3>Hip Thrust</h3>
          </div>
          <div id="stif" className="Legs1" onClick={() => openDetails(51)}>
            <h3>Stiff Leg Deadlift</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
