import React, { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      const profileData = localStorage.getItem("profile");
      
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (profileData) {
        setProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    navigate("/");
  };


  if (isLoading) {
    return (
      <div className="profile-main">
        <div className="profile-container loading">
        </div>
      </div>
    );
  }

  return (
    <div className="profile-main">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Hi! {profile?.name || user?.username}</h2>
        </div>

        <div className="profile-avatar">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              <User size={48} />
            </div>
          )}
        </div>

        <div className="profile-details">
          <div className="profile-item">
            <span className="profile-label">Name:</span>
            <span className="profile-value">{profile?.name || user?.username}</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{user?.email}</span>
          </div>
           <div className="profile-details1">
          <div className="profile-item">
            <span className="profile-label">Age:</span>
            <span className="profile-value">{profile?.age || user?.age}</span>
          </div>
         
          <div className="profile-item">
            <span className="profile-label">Height:</span>
            <span className="profile-value">{profile?.height || user?.height} cm</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Weight:</span>
            <span className="profile-value">{profile?.weight || user?.weight}kg</span>
          </div>

          <div className="profile-item">
            <span className="profile-label">Gender:</span>
            <span className="profile-value">{profile?.gender || user?.gender}</span>
          </div>
          </div>

          <div className="profile-item">
            <span className="profile-label">Member Since:</span>
            <span className="profile-value">
              {profile?.joinDate || "January 2026"}
            </span>
          </div>
          
        </div>

        <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleLogout}>
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}