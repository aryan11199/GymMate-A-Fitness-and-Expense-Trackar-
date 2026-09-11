import React from "react";
import { useState } from "react";
import Details from "../details";
import "./back.css";
export default function Back() {
  const [isopen, setIsOpen] = useState(false);
  const [exerciseId, setExerciseId] = useState(null);
  const openDetails = (id) => {
    setExerciseId(id);
    setIsOpen(true);
  };
  return (
    <div className="main">
      <div className="back-body">
        <h1>Back Exercises</h1>
        <div className="back-content">
          <div id="pull-ups" className="back1" onClick={() => openDetails(27)}>
            <h3>Pull-Ups</h3>
          </div>
          <div id="lat" className="back1" onClick={() => openDetails(26)}>
            <h3>Lat Pulldown</h3>
          </div>
          <div id="seat" className="back1" onClick={() => openDetails(28)}>
            <h3>Seated Cable Row</h3>
          </div>
          <div id="bell" className="back1" onClick={() => openDetails(29)}>
            <h3>Barbell Bent-over Row</h3>
          </div>
          <div id="hyper" className="back1" onClick={() => openDetails(30)}>
            <h3>Hyperextention</h3>
          </div>
          <div id="face" className="back1" onClick={() => openDetails(31)}>
            <h3>Face Pull</h3>
          </div>
          <div id="str" className="back1" onClick={() => openDetails(32)}>
            <h3>Straight-Arm Pulldown</h3>
          </div>
          <div id="one" className="back1" onClick={() => openDetails(33)}>
            <h3>One-ArmDumbbell Row</h3>
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
