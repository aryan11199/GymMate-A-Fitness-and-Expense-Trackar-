import axios from "axios";
import React, { useEffect, useState } from "react";
import "./details.css";

export default function Details({ isOpen, onClose, exerciseId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!exerciseId) return;

    setLoading(true);
    axios
      .get(`http://localhost:3001/exercises/${exerciseId}`)
      .then((res) => {
        setDetails(res.data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [exerciseId]);

  if (!isOpen) return null;
  if (loading) return <div className="detail-body">Loading...</div>;
  if (!details) return <div className="detail-body">No data found</div>;

  const instructions = details.instruction?.split("\n") || [];

  return (
    <div className="detail-body">
      <div className="details">
        <div className="detail-header">
          <h2>{details.name}</h2>
          <span className="close" onClick={onClose}>
            ×
          </span>
        </div>
        <div className="details1">
          {details.image_url && (
          <img src={details.image_url} alt={details.name} />
        )}
        <p><b>{details.name}</b></p>
        </div>
        
        <div className="details2">
          <span><b>Body Part:</b> {details.body_part}</span>
          <span><b>Muscle Group:</b> {details.muscle_group}</span>
          <span><b>Level:</b> {details.level}</span>
          <span><b>Equipment:</b> {details.equipment}</span>
        </div>
        <div className="details3">
          <h3>Instructions</h3>
        <ul>
          {instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
        </div>
        
      </div>
    </div>
  );
}
