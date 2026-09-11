import React from "react";
import "./warmup.css";
import { useState } from "react";
import Details from "../details";
export default function Warmups() {
  const [isopen, setIsOpen] = useState(false);
  const [exerciseId, setExerciseId] = useState(null);
  const openDetails = (id) => {
    setExerciseId(id);
    setIsOpen(true);
  };
  return (
    <div className="main">
      <div className="Warmups-body">
        <h1>Warm-up Exercises</h1>
        <div className="Warmups-content">
          <div id="JP" className="Warmups1" onClick={() => openDetails(43)}>
            <h3>Jumping Jacks</h3>
          </div>
          <div id="HK" className="Warmups1" onClick={() => openDetails(44)}>
            <h3>High Knees</h3>
          </div>
          <div id="MC" className="Warmups1" onClick={() => openDetails(45)}>
            <h3>Mountain Climbers</h3>
          </div>
          <div id="JS" className="Warmups1" onClick={() => openDetails(46)}>
            <h3>Jump Squat</h3>
          </div>
          <div id="Plank" className="Warmups1 " onClick={() => openDetails(47)}>
            <h3>Plank</h3>
          </div>
          <div id="PS" className="Warmups1" onClick={() => openDetails(48)}>
            <h3>Push Up</h3>
          </div>
          <Details
                    isOpen={isopen}
                    exerciseId={exerciseId}
                    onClose={() => setIsOpen(false)}
                  />
        </div>
      </div>
    </div>
  );
}
