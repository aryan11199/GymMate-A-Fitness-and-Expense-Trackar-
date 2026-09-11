import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  House,
  Target,
  Wallet,
  Settings,
  Dumbbell,
  LogOut,
  Menu,
  User,
  BarChart3,
  UtensilsCrossed,
  X,
} from "lucide-react";
import logo1 from "../images/logo1.jpg";
import "./dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(window.innerWidth > 768);
  const user = JSON.parse(localStorage.getItem("user"));
  const [googleFitConnected, setGoogleFitConnected] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setOpen(true);
      else setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:3001/google-fit/token/${user.id}`)
      .then((res) => setGoogleFitConnected(res.data.connected))
      .catch(() => setGoogleFitConnected(false));
  }, [user, navigate]);

  const connectGoogleFit = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    alert("Logged out successfully!");
  };

  const handleNav = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) setOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`dashboard ${open ? "open" : "close"}`}>
      {/* Mobile Overlay */}
      {open && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>
      )}

      <div className="sidebar">
        <div className="logo">
          <img src={logo1} alt="logo" />
          {open && <h2>GymMate</h2>}
          <X className="mobile-close-btn" onClick={() => setOpen(false)} />
        </div>

        <nav>
          <a
            className={isActive("/dashboard") ? "active" : ""}
            onClick={() => handleNav("/dashboard")}
          >
            <House /> {open && "Home"}
          </a>
          <a
            className={isActive("/dashboard/workout") ? "active" : ""}
            onClick={() => handleNav("/dashboard/workout")}
          >
            <Dumbbell /> {open && "Workout"}
          </a>
          <a
            className={isActive("/dashboard/goal") ? "active" : ""}
            onClick={() => handleNav("/dashboard/goal")}
          >
            <Target /> {open && "Goals"}
          </a>
          <a
            className={isActive("/dashboard/expense") ? "active" : ""}
            onClick={() => handleNav("/dashboard/expense")}
          >
            <Wallet /> {open && "Expenses"}
          </a>
          <a
            className={isActive("/dashboard/analysis") ? "active" : ""}
            onClick={() => handleNav("/dashboard/analysis")}
          >
            <BarChart3 /> {open && "Analysis"}
          </a>
          <a
            className={isActive("/dashboard/diet") ? "active" : ""}
            onClick={() => handleNav("/dashboard/diet")}
          >
            <UtensilsCrossed /> {open && "Diet Planner"}
          </a>
        </nav>
      </div>

      <div className="main">
        <div className="topbar">
          <div className="topbar1">
            <Menu onClick={() => setOpen(!open)} className="menu-btn" />
            <span className="user-welcome">Welcome, {user?.username}</span>

            <div className="google-fit-section">
              {!googleFitConnected ? (
                <button
                  onClick={connectGoogleFit}
                  className="connect-google-btn"
                >
                  🔗 Connect
                </button>
              ) : (
                <div className="google-fit-badge">✅ Connected</div>
              )}
            </div>
          </div>

          <div className="topbar2">
            <a onClick={() => handleNav("/dashboard/setting")} title="Settings">
              <Settings
                className={isActive("/dashboard/setting") ? "active-icon" : ""}
              />
            </a>
            <a onClick={() => handleNav("/dashboard/Profile")} title="Profile">
              <User />
            </a>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
