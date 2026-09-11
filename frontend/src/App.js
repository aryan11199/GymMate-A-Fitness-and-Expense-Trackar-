import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "./components/Loader/loader";
import LoginSignUp from "./components/LoginSignUp/LoginSignUp";
import Dashboard from "./components/Dashboard/dashboard";
import Profile from "./components/profile/Profile";
import Workout from "./components/Workout/workout";
import  Home  from "./components/Home/home";
import Steps from "./components/Steps/step";
import Goals from "./components/Goals/goal";
import Expenses from "./components/Expenses/expense";
import Settings from "./components/Settings/setting";
import AddTransaction from "./components/Expenses/addTransaction";
import Transactions from "./components/Expenses/transactions";
import AddWorkout from "./components/Workout/AddWorkout";
import Admin from "./Admin/admin";
import UserActivity from "./Admin/Activity";
import Reports from "./Admin/reports";
import Chest from "./components/Home/workouts/Chest/chest"; 
import Back from "./components/Home/workouts/Back/back";
import Shoulder from "./components/Home/workouts/Shoulder/shoulder";
import Legs from "./components/Home/workouts/Legs/legs";
import Abs from "./components/Home/workouts/Abs/abs";
import Cardio from "./components/Home/workouts/Cardio/cardio";
import Arms from "./components/Home/workouts/Arms/arms";
import Details from "./components/Home/workouts/details";
import AddGoal from "./components/Goals/addGoal";
import Analysis from "./components/Analysis/analysis";
import Diet from "./components/Diet/diet";
import Warm from "./components/Home/workouts/Warmups/warmups";


function App() {
   const [loading, setLoading] = useState(true);
  const [jwt] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<LoginSignUp />}></Route> 
      <Route path="/signup" element={<LoginSignUp />}></Route>

      <Route path="/admin" element={<Admin/>}>
      <Route path="/admin/Activity" element={<UserActivity />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/Profile" element={< Profile token={jwt} />}></Route>
      </Route>

      <Route path="/dashboard" element={<Dashboard />}>
      <Route path="/dashboard/Profile" element={< Profile token={jwt} />}></Route>
      <Route path="" element={<Home />}></Route> 
      <Route path="/dashboard/workout" element={< Workout />}></Route>
      <Route path="/dashboard/step" element={< Steps />}></Route>
      <Route path="/dashboard/analysis" element={< Analysis />}></Route>
      <Route path="/dashboard/goal" element={< Goals />}></Route>
      <Route path="/dashboard/expense" element={< Expenses />}></Route>
      <Route path="/dashboard/setting" element={< Settings />}></Route>
      <Route path="/dashboard/addTransaction" element={< AddTransaction />}></Route>
      <Route path="/dashboard/transactions" element={< Transactions />}></Route>
      <Route path="/dashboard/AddWorkout" element={< AddWorkout />}></Route>
      <Route path="/dashboard/chest" element={<Chest/>}></Route>
      <Route path="/dashboard/back" element={<Back/>}></Route>
      <Route path="/dashboard/shoulder" element={<Shoulder/>}></Route>
      <Route path="/dashboard/legs" element={<Legs/>}></Route>
      <Route path="/dashboard/abs" element={<Abs/>}></Route>
      <Route path="/dashboard/cardio" element={<Cardio/>}></Route>
      <Route path="/dashboard/arms" element={<Arms/>}></Route>
      <Route path="/dashboard/exercises/:id" element={<Details/>}></Route>
      <Route path="/dashboard/addGoal" element={<AddGoal/>}></Route>
      <Route path="/dashboard/diet" element={<Diet/>}></Route>
      <Route path="/dashboard/warm" element={<Warm/>}></Route>
      </Route>
    </Routes> 
  );
}

export default App;
