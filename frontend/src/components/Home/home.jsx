import { useEffect, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { Receipt, Footprints, Dumbbell, RefreshCw } from "lucide-react";
import axios from "axios";
import Steps from "../Steps/step";

export default function Home() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [todaySteps, setTodaySteps] = useState(null);
  const [googleFitConnected, setGoogleFitConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:3001/google-fit/token/${user.id}`)
      .then((res) => {
        setGoogleFitConnected(res.data.connected);
        if (res.data.connected) fetchGoogleFitSteps(res.data.token);
      })
      .catch(() => setGoogleFitConnected(false));
  }, [user]);

  useEffect(() => {
    axios.get(`http://localhost:3001/steps/${user.id}`).then((res) => {
      if (res.data && res.data.length > 0) setTodaySteps(res.data[0]);
    });
  }, [user.id]);

  const fetchGoogleFitSteps = async (token) => {
    try {
      const res = await axios.get("http://localhost:3001/google-fit/steps", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const totalSteps = res.data.steps;
      const distance = ((totalSteps * 0.762) / 1000).toFixed(2);
      const calories = Math.round(totalSteps * 0.04);
      await axios.post("http://localhost:3001/steps", {
        user_id: user.id,
        step: totalSteps,
        distance: distance,
        calories: calories,
      });
      setTodaySteps({
        step: totalSteps,
        distance: distance,
        calories: calories,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/workouts/${user.id}`)
      .then((res) => setWorkouts(res.data));
  }, [user.id]);

  useEffect(() => {
    const today = new Date().toDateString();
    setTodayWorkouts(
      workouts.filter((w) => new Date(w.date).toDateString() === today),
    );
  }, [workouts]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/transactions/${user.id}`)
      .then((res) => setTransactions(res.data));
  }, [user.id]);

  useEffect(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      if (t.type === "Income") income += t.amount;
      if (t.type === "Expense") expense += t.amount;
    });
    setTotalIncome(income);
    setTotalExpense(expense);
    setTotalBalance(income - expense);
  }, [transactions]);

  const syncSteps = async () => {
    try {
      setLoading(true);
      await axios.get(`http://localhost:3001/google-fit/sync-steps/${user.id}`);
      window.location.reload();
    } catch (err) {
      alert("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="content">
        {googleFitConnected && (
          <div className="sync-container">
            <div className="status-badge-green">
              ✅ Google Fit Connected
              <button onClick={syncSteps} className="sync-mini-btn">
                <RefreshCw size={12} className={loading ? "spin" : ""} /> Sync
              </button>
            </div>
          </div>
        )}

        <div className="card">
          {/* Steps Card */}
          <div className="func">
            <div className="h2" style={{ backgroundColor: "orange" }}>
              <h3>Today's Steps</h3>
              <Footprints size={40} />
            </div>
            {todaySteps ? (
              <div className="val">
                <p>
                  <b>Steps:</b> {todaySteps.step || 0}
                </p>
                <p>
                  <b>Calories:</b> {todaySteps.calories || 0}
                </p>
                <p>
                  <b>Distance:</b> {todaySteps.distance || 0} km
                </p>
              </div>
            ) : (
              <p className="val">No data available</p>
            )}
            <button onClick={() => setShowSteps(true)} className="step-btn">
              Tap To Reconnect
            </button>

            <Steps isOpen={showSteps} onClose={() => setShowSteps(false)} />
          </div>

          {/* Workout Card */}
          <div className="func">
            <div className="h2" style={{ backgroundColor: "#0046FF" }}>
              <h3>Today's Workout</h3>
              <Dumbbell size={30} color="white" />
            </div>
            <div className="val">
              {todayWorkouts.length > 0 ? (
                todayWorkouts.map((w, index) => (
                  <div className="val1" key={index}>
                    <h3>Activity: {w.type}</h3>
                    <div className="val2">
                      <p>⏱️ {w.duration} min</p>
                      <p>🔥 {w.calories} cal</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No workout today</p>
              )}
            </div>
          </div>

          {/* Expense Card */}
          <div className="func">
            <div className="h2" style={{ backgroundColor: "#00C853" }}>
              <h3>Total Expense</h3>
              <Receipt size={30} color="white" />
            </div>
            <div className="ex-amt">
              <h4 className="out">₹{totalExpense}</h4>
              <div className="p">
                <p>Budget</p>
                <p>₹{totalIncome}</p>
              </div>
              <div className="p1">
                <p>Remaining</p>
                <p>₹{totalBalance}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="body-parts">
          <h1>Exercises</h1>
          <div className="part-card">
            {[
              "warm",
              "chest",
              "back",
              "shoulder",
              "legs",
              "abs",
              "cardio",
              "arms",
            ].map((id) => (
              <div
                key={id}
                id={id}
                className="part-card1"
                onClick={() => navigate(`/dashboard/${id}`)}
              >
                <h2>{id.charAt(0).toUpperCase() + id.slice(1)}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
