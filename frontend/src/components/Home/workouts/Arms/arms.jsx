import React, { useState } from "react";
import "./arms.css";
import Details from "../details";
export default function Arms() {
  const [isopen, setIsOpen] = useState(false);
  const [exerciseId, setExerciseId] = useState(null);
  const openDetails = (id) => {
    setExerciseId(id);
    setIsOpen(true);
  };
  return (
    <div className="main">
      <div className="Arms-body">
        <h1>Arms Exercises</h1>
        <div className="Arms-content">
          <div id="bicep" className="Arms1" onClick={() => openDetails(1)}>
            <h3>Bicep Curl</h3>
          </div>

          <div id="hammer" className="Arms1" onClick={()=> openDetails(2)}>
            <h3>Hammer Curl</h3>
          </div>
          <div id="tricep" className="Arms1"onClick={()=> openDetails(3)}>
            <h3>Tricep Dips</h3>
          </div>
          <div id="Pushdown" className="Arms1"onClick={()=> openDetails(5)}>
            <h3>Pushdown</h3>
          </div>
          <div id="wrist" className="Arms1"onClick={()=> openDetails(6)}>
            <h3>Wrist Curl</h3>
          </div>
          <div id="roller" className="Arms1"onClick={()=> openDetails(7)}>
            <h3>Wrist Roller</h3>
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
