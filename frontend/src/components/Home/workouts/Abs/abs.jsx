import React from "react";
import { useState } from "react";
import "./abs.css";
import Details from "../details";
export default function Abs() {
  const [isopen, setIsOpen] = useState(false);
    const [exerciseId, setExerciseId] = useState(null);
    const openDetails = (id) => {
      setExerciseId(id);
      setIsOpen(true);
    };
  return (
    <div className="main">
      <div className="abs-body">
        <h1>Abs Exercises</h1>
        <div className="abs-content">
          <div id="crunch" className="abs1" onClick={()=> openDetails(20)}>
            <h3>Crunches</h3>
          </div>
          <div id="Leg-rais" className="abs1" onClick={()=> openDetails(21)}>
            <h3>Leg Raises</h3>
          </div>
          <div id="Plank" className="abs1" onClick={()=> openDetails(22)}>
            <h3>Plank</h3>
          </div>
          <div id="cycle" className="abs1" onClick={()=> openDetails(23)}>
            <h3>Bicycle Crunch</h3>
          </div>
          <div id="twist" className="abs1" onClick={()=> openDetails(24)}>
            <h3>Russian Twist</h3>
          </div>
          <div id="hang" className="abs1" onClick={()=> openDetails(25)}>
            <h3>Hangign Leg Raises</h3>
          </div>
        </div>
        <Details
          isOpen={isopen}
          exerciseId={exerciseId}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
}
