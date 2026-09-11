// import React, { useState } from "react";
// import { LogOut, Upload } from "lucide-react";
// // import "./Profile.css";
// import "./update.css";
// import logo from "../images/logo.jpg";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function Update() {
//   const [FullName, setFullName] = useState(" ");
//   const [Email, setEmail] = useState("");
//   const [Password, setPassword] = useState("");
//   const [ConfirmPassword, setConfirmPassword] = useState("");
//   const navigate = useNavigate();

//   const handleUpdate = (e) => {
//     e.preventDefault();
//     if (!FullName || !Email || !Password || !ConfirmPassword) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     if (Password !== ConfirmPassword) {
//       alert("Passwords don't match!");
//       return;
//     }

//     if (!Email.includes("@") || !Email.includes(".")) {
//       alert("Please enter a valid email address.");
//       return;
//     }
//     axios
//       .post("http://localhost:3001/update", {
//         username: FullName,
//         email: Email,
//         password: Password,
//       })
//       .then((res) => console.log(res))
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="main">
//       <div className="update-container">
//         <h2>Update Your Profile!</h2>
//         <div className="update">
//           <div className="up">
//             Name:
//             <br></br>
//             <input
//               type="text"
//               placeholder="enter your name"
//               value={FullName}
//               onChange={(e) => setFullName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="up">
//             Email:
//             <br />
//             <input
//               type="email"
//               placeholder="abc@gmail.com"
//               value={Email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="up">
//             Password:
//             <br />
//             <input
//               type="password"
//               placeholder=".........."
//               value={Password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="up">
//             ConfirmPassword:
//             <br />
//             <input
//               type="password"
//               placeholder=".........."
//               value={ConfirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>
//         </div>

//         <div className="update-btn">
//           <a onClick={handleUpdate}>
//             <Upload /> Update
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }
