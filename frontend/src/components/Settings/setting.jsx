import React, { useState } from "react";
import {
  Target,
  User,
  Calendar,
  Scale,
  Ruler,
  LogOut,
  Mars,
} from "lucide-react";
import "./setting.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Setting() {
  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [Name, setName] = useState(profile.name || user.username || "");
  const [Age, setAge] = useState(user.age || "");
  const [Weight, setWeight] = useState(user.weight || "");
  const [Height, setHeight] = useState(user.height || "");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!Name || !Age || !Weight || !Height) {
      alert("Please fill all fields.");
      return;
    }

    axios
      .post("http://localhost:3001/profile", {
        name: Name,
        age: Age,
        weight: Weight,
        height: Height,
        gender: user.gender,
      })
      .then((res) => {
        if (res.data.message === "update successful") {
          localStorage.setItem("profile", JSON.stringify(res.data.profile));
          navigate("/dashboard/setting");
        } else {
          alert("Not Updated!");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("profile");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="main">
      <div className="user_set">
        <h1>SETTINGS</h1>
        <h4>Manage your profile and preferences</h4>
        <div className="user">
          <div className="user_head">
            <h2>
              <User /> Profile Setting
            </h2>
            <h4>Update your personal information</h4>
          </div>
          <div className="user_container">
            <div className="Name1">
              Name:
              <br />
              <input
                type="text"
                placeholder="Enter Name"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="age">
              Age:
              <br />
              <input
                type="number"
                placeholder="18"
                value={Age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div className="weight">
              Weight(kg):
              <br />
              <input
                type="number"
                placeholder="70"
                value={Weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>

            <div className="height">
              Height(cm):
              <br />
              <input
                type="number"
                placeholder="175"
                value={Height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>

            <div className="bt">
              <button onClick={handleSubmit}>Update Profile</button>
            </div>
          </div>
        </div>

        <div className="store">
          <div className="profile_summary">
            <h2>Profile Summary</h2>
            <h4>Your current profile information</h4>
          </div>
          <div className="info">
            <div className="store1">
              <span>
                <User color="#4f46e5" size={22} /> Name
              </span>
              <h4>{Name}</h4>
            </div>
            <div className="store1">
              <span>
                <Mars color="yellow" size={25} /> Gender
              </span>
              <h4>{user.gender}</h4>
            </div>
            <div className="store1">
              <span>
                <Calendar color="green" size={22} /> Age
              </span>
              <h4>{Age}</h4>
            </div>
            <div className="store1">
              <span>
                <Scale color="purple" size={25} /> Weight
              </span>
              <h4>{Weight}</h4>
            </div>
            <div className="store1">
              <span>
                <Ruler color="orange" size={25} /> Height
              </span>
              <h4>{Height}</h4>
            </div>
          </div>
          <div className="bt1">
            <button onClick={handleLogout}>
              <LogOut /> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
