import React from "react";
import "./loader.css";

export default function Loader() {
  return (
    <div className="loader-overlay">
      <h1 className="gymmate">
        <span>G</span>
        <span>y</span>
        <span>m</span>
        <span>M</span>
        <span>a</span>
        <span>t</span>
        <span>e</span>
      </h1>
      <p className="tagline">Fitness & Expense Tracker</p>
    </div>
  );
}
