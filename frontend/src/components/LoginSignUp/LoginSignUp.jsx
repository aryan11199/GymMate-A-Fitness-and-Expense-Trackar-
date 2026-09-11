import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo1 from "../images/logo1.jpg";
import "./SignUp.css";
import "./Login.css";

export default function LoginSignup() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // SIGNUP STATES
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Age, setAge] = useState("");
  const [Gender, setGender] = useState("");
  const [Height, setHeight] = useState("");
  const [Weight, setWeight] = useState("");

  // LOGIN STATES
  const [LoginEmail, setLoginEmail] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");

  // -------------- SIGNUP SUBMIT ----------------
  const handleSignup = (e) => {
    e.preventDefault();

    if (
      !FullName ||
      !Email ||
      !Password ||
      !Age ||
      !Gender ||
      !Height ||
      !Weight
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (!Email.includes("@") || !Email.includes(".")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!Age || Age < 12 || Age <= 18) {
      alert("Please enter valid age");
      return;
    }
    if (!Weight || Weight <= 0) {
      alert("Please enter valid weight");
      return;
    }
    if (!Height || Height <= 0) {
      alert("Please enter valid height");
      return;
    }


    axios
      .post("http://localhost:3001/signup", {
        username: FullName,
        email: Email,
        password: Password,
        age: Age,
        gender: Gender,
        height: Height,
        weight: Weight,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    setIsLogin(false);
    setTimeout(() => {
      alert("Account created successfully!");
    }, 200);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!LoginEmail || !LoginPassword) {
      alert("Please fill in both fields.");
      return;
    }

    if (!LoginEmail.includes("@") || !LoginEmail.includes(".")) {
      alert("Please enter a valid email.");
      return;
    }

    axios
      .post("http://localhost:3001/login", {
        email: LoginEmail,
        password: LoginPassword,
      })
      .then((res) => {
        if (res.data.message === "Login successful") {
          localStorage.setItem("user", JSON.stringify(res.data.user));

          if (res.data.user.role === "admin") {
            navigate("/admin/Activity");
          } else {
            alert("Login successful!");
            navigate("/dashboard");
          }
        } else {
          alert("Invalid email or password");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {isLogin ? (
        /* ------------------ SIGNUP FORM ------------------ */
        <div className="body">
          <div className="title">
            <img src={logo1} alt="GymMate Logo" />
            <div className="Text">
              <div className="text1">GymMate</div>
              <div className="text2">fitness & Expense Tracker</div>
            </div>
          </div>

          <div className="container">
            <div className="heading">
              <div className="text">Create Account</div>
              <div className="txt">
                Join GymMate to start your fitness journey
              </div>
            </div>

            <div className="header">
              <div className="underline"></div>
            </div>

            <form className="LoginSignup" onSubmit={handleSignup}>
              <div className="SignUp">
                Name <br />
                <input
                  type="text"
                  placeholder="XYZ"
                  value={FullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="SignUp">
                Email <br />
                <input
                  type="email"
                  placeholder="abc@gmail.com"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="SignUp">
                Password <br />
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="personal">
                <div className="personal1">
                  Age <br />
                  <input
                    type="number"
                    placeholder="Enter Age"
                    value={Age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>
                <div className="personal1">
                  Gender <br />
                  <select
                    value={Gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="Slect">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>                    
                  </select>
                </div>
                <div className="personal1">
                  Weight <br /> 
                  <input
                    type="number"
                    placeholder="Enter Weight"
                    value={Weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>
                <div className="personal1">
                  Height <br />
                  <input
                    type="number"
                    placeholder="Enter Height"
                    value={Height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button className="btn" type="submit">
                Create Account
              </button>

              <div className="signin">
                Already have an account?{" "}
                <a href="#" onClick={() => setIsLogin(false)}>
                  Sign In
                </a>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* ------------------ LOGIN FORM ------------------ */
        <div className="body">
          <div className="title">
            <img src={logo1} alt="GymMate Logo" />
            <div className="Text">
              <div className="text1">GymMate</div>
              <div className="text2">fitness & Expense Tracker</div>
            </div>
          </div>

          <div className="Login form">
            <div className="container1">
              <div className="heading">
                <div className="text">Welcome Back</div>
                <div className="txt">
                  Sign in to track your fitness and expenses
                </div>
              </div>

              <div className="header">
                <div className="underline"></div>
              </div>

              <form className="LoginSignup" onSubmit={handleLogin}>
                <div className="Login">
                  Email <br />
                  <input
                    type="email"
                    placeholder="abc@gmail.com"
                    value={LoginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="Login">
                  Password <br />
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={LoginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="forgot">
                  <a href="#">Forgot Password?</a>
                </div>

                <button className="btn" type="submit">
                  Login
                </button>

                <div className="signup">
                  Don’t have an account?{" "}
                  <a href="#" onClick={() => setIsLogin(true)}>
                    Sign Up
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
