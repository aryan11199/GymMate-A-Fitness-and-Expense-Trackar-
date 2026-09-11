import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./step.css";

export default function Steps({ isOpen, onClose }) {
  const location = useLocation();

  const [steps, setSteps] = useState(null);
  const [status, setStatus] = useState("Not connected");

  const user = JSON.parse(localStorage.getItem("user"));

  const connectGoogleFit = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  useEffect(() => {
    if (!user || !isOpen) return;

    const urlParams = new URLSearchParams(location.search);
    const connected = urlParams.get("connected");

    if (connected === "true") {
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        checkConnectionAndFetch();
      }, 1000);
    } else {
      checkConnectionAndFetch();
    }
  }, [user, location, isOpen]);

  const checkConnectionAndFetch = () => {
    axios
      .get(`http://localhost:3001/google-fit/token/${user.id}`)
      .then((res) => {
        if (res.data.connected) {
          setStatus("Connected ✅");
          fetchSteps(res.data.token);
        } else {
          setStatus("Not connected ❌");
        }
      })
      .catch(() => setStatus("Not connected ❌"));
  };

  const fetchSteps = async (token) => {
    try {
      const res = await axios.get("http://localhost:3001/google-fit/steps", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSteps(res.data.steps);
      setStatus("Connected ✅");
    } catch (err) {
      console.error("Fetch steps error:", err);
      setStatus("Failed to fetch steps ❌");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="step-overlay" onClick={onClose}>
      <div className="step-container" onClick={(e) => e.stopPropagation()}>
        <div className="steps">
          {/* Close Button */}
          <div style={{ textAlign: "right" }}>
            <span
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={onClose}
            >
              ✖
            </span>
          </div>

          <button onClick={connectGoogleFit}>
            {status === "Connected ✅"
              ? "Reconnect Google Fit"
              : "Connect to Google Fit"}
          </button>

          <h2>Google Fit Status</h2>
          <p>{status}</p>

          <h2>Google Fit Steps</h2>
          {steps !== null ? <h3>{steps} steps</h3> : <p>No data</p>}
        </div>
      </div>
    </div>
  );
}
