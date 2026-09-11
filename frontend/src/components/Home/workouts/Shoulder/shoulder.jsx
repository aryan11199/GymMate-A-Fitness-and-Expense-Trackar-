import React from "react";
import "./shoulder.css";
import { useState } from "react";
import Details from "../details";

export default function Shoulder() {
  const [isopen, setIsOpen] = useState(false);
  const [exerciseId, setExerciseId] = useState(null);
  const openDetails = (id) => {
    setExerciseId(id);
    setIsOpen(true);
  };
  return (
    <div className="main">
      <div className="shoulder-body">
        <h1>Shoulder Exercises</h1>
        <div className="shoulder-content">
          <div id="over" className="shoulder1" onClick={() => openDetails(34)}>
            <h3>Overhead Press</h3>
          </div>
          <div id="Raise" className="shoulder1" onClick={() => openDetails(35)}>
            <h3>Lateral Raise</h3>
          </div>
          <div id="front" className="shoulder1" onClick={() => openDetails(36)}>
            <h3>Front Raise</h3>
          </div>
          <div id="rear" className="shoulder1" onClick={() => openDetails(37)}>
            <h3>Rear Delt Fly</h3>
          </div>
          <div
            id="arnold"
            className="shoulder1"
            onClick={() => openDetails(38)}
          >
            <h3>Arnold Press</h3>
          </div>
          <div
            id="upright"
            className="shoulder1"
            onClick={() => openDetails(39)}
          >
            <h3>Upright Row</h3>
          </div>
          <div id="shrug" className="shoulder1" onClick={() => openDetails(40)}>
            <h3>Shrugs</h3>
          </div>
          <div id="Y" className="shoulder1" onClick={() => openDetails(41)}>
            <h3>Cable Y Raise</h3>
          </div>
          <div id="push" className="shoulder1" onClick={() => openDetails(42)}>
            <h3>Push Press</h3>
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
