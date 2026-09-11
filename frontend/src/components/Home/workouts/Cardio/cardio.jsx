import React from "react";
import { useState } from "react";
import "./cardio.css";
import Details from "../details";
export default function Cardio() {
  const [isopen, setIsOpen] = useState(false);
  const [exerciseId, setExerciseId] = useState(null);
  const openDetails = (id) => {
    setExerciseId(id);
    setIsOpen(true);
  };
  return (
    <div className="main">
      <div className="Cardio-body">
        <h1>Cardio Exercises</h1>
        <div className="Cardio-content">
          <div id="Cycling" className="Cardio1" onClick={() => openDetails(8)}>
            <h3>Cycling</h3>
          </div>
          <div id="jump" className="Cardio1" onClick={() => openDetails(9)}>
            <h3>Jumping Jacks</h3>
          </div>
          <div id="jog" className="Cardio1" onClick={() => openDetails(10)}>
            <h3>Jogging</h3>
          </div>
          <div id="skip" className="Cardio1" onClick={() => openDetails(11)}>
            <h3>Skipping</h3>
          </div>
          <div id="high" className="Cardio1" onClick={() => openDetails(12)}>
            <h3>High Knee</h3>
          </div>
          <div id="burp" className="Cardio1" onClick={() => openDetails(13)}>
            <h3>Burpees</h3>
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
