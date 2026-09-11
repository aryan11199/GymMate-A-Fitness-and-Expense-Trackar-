import React from "react";
import { useState } from "react";
import "./chest.css";
import Details from "../details";

export default function Chest() {
  const [isopen, setIsOpen] = useState(false);
  const [exerciseId, setExerciseId] = useState(null);
  const openDetails = (id) => {
    setExerciseId(id);
    setIsOpen(true);
  };
  return (
    <div className="main">
      <div className="chest-body">
        <h1>Chest Exercises</h1>
        <div className="chest-content">
          <div id="up" className="chest1" onClick={() => openDetails(14)}>
            <h3>Push-Ups</h3>
          </div>
          <div id="bench" className="chest1" onClick={() => openDetails(15)}>
            <h3> Bench Press</h3>
          </div>
          <div id="in" className="chest1" onClick={() => openDetails(16)}>
            <h3>Incline Dumbble Press</h3>
          </div>
          <div id="de" className="chest1" onClick={() => openDetails(17)}>
            <h3>Decline Dumbble Press</h3>
          </div>
          <div id="fly" className="chest1" onClick={() => openDetails(18)}>
            <h3>Chest Fly</h3>
          </div>
          <div id="pull" className="chest1" onClick={() => openDetails(19)}>
            <h3>Dumbbell Pullover</h3>
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
