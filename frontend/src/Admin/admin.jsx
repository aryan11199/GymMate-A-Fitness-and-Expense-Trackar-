import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo1 from "../components/images/logo1.jpg";
import "./admin.css";
import { LogOut, Menu, User, Dock, X } from "lucide-react"; 

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState(window.innerWidth > 768); 
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNav = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) setOpen(false);
  };

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || storedUser.role !== "admin") {
        navigate("/");
      } else {
        setChecking(false);
      }
    } catch (error) {
      navigate("/");
    }
  }, [navigate]);

  if (checking) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`admin ${open ? "open" : "close"}`}>
      {open && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>
      )}

      <div className="sidebar">
        <div className="logo">
          <img src={logo1} alt="logo" />
          {open && <h2>GymMate</h2>}
          <X className="mobile-close-btn" onClick={() => setOpen(false)} />
        </div>

        <a
          className={isActive("/admin/Activity") ? "active" : ""}
          onClick={() => handleNav("/admin/Activity")}
        >
          <User /> {open && "Activity"}
        </a>

        <a
          className={isActive("/admin/reports") ? "active" : ""}
          onClick={() => handleNav("/admin/reports")}
        >
          <Dock /> {open && "Reports"}
        </a>

        <a onClick={handleLogout}>
          <LogOut /> {open && "Logout"}
        </a>
      </div>

      <div className="Main">
        <div className="Topbar">
          <div className="Topbar1">
            <Menu onClick={() => setOpen(!open)} className="menu-btn" />
            <span>Welcome, {user?.username}</span>
          </div>

          <div className="Topbar2">
            <a onClick={() => handleNav("/admin/Profile")}>
              <User />
            </a>
            <a className="Logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> LogOut
            </a>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
