import React, { useState, useEffect } from "react";
import "./diet.css";
import { Bot, Target, Scale, User, Salad } from "lucide-react";
import axios from "axios";

export default function Diet() {
  const [plan, setPlan] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  useEffect(() => {
    if (!userId) {
      console.log("No user logged in");
      return;
    }
    axios
      .get(`http://localhost:3001/diet-plan/${userId}`)
      .then((res) => {
        if (res.data) {
          setPlan(res.data.plan_content);
          setAge(res.data.age);
          setWeight(res.data.weight);
          setGoal(res.data.goal);
          setType(res.data.diet_type);
        }
      })
      .catch((err) => {
        console.error("Error loading diet plan:", err);
      });
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please log in first");
      return;
    }

    if (!age || !weight || !goal || !type) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);
    setPlan("");

    axios
      .post("http://localhost:3001/chat", {
        age,
        weight,
        goal,
        dietType: type,
        user_id: userId,
      })
      .then((res) => {
        console.log("Response:", res.data.dietPlan);
        setPlan(res.data.dietPlan);
        setLoading(false);
        alert("Diet plan generated successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to generate diet plan");
        setLoading(false);
      });
  };


  const renderDietPlan = (text) => {
    if (!text) return <p>Your diet plan will appear here</p>;

    const lines = text.split('\n');
    
    return (
      <div className="formatted-plan">
        <div className="plan-header">
          <Bot size={20} color="#10b981" />
          <h3>Your Diet Plan</h3>
        </div>
        <div className="plan-content">
          {lines.map((line, index) => {
            const trimmed = line.trim();
            
            if (!trimmed) return null;

            if (trimmed.match(/^(Breakfast|Lunch|Dinner|Snacks?|Mid-Afternoon|Total)/i)) {
              return <h4 key={index} className="meal-heading">{trimmed}</h4>;
            }
            
            if (trimmed.match(/Option \d+:/i)) {
              return <p key={index} className="meal-option">{trimmed.replace(/\*\*/g, '')}</p>;
            }
            
            if (trimmed.match(/^[\*\-]/)) {
              return (
                <li key={index} className="meal-item">
                  {trimmed.replace(/^[\*\-]+\s*/, '').replace(/\*\*/g, '')}
                </li>
              );
            }
            
            return <p key={index} className="meal-text">{trimmed.replace(/\*\*/g, '')}</p>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="main">
      <div className="diet">
        <div className="diet-head">
          <h1>
            <Bot size={30} color="blue" />
            AI Diet Planner
          </h1>
          <h4>
            Generate a personalized diet plan tailored to your fitness goals.
          </h4>
        </div>
        <div className="diet-body">
          <h2>Diet Plan</h2>
          <div className="under"></div>
          <div className="diet-body1">
            <form>
              <span>
                <User size={30} color="blue" />
                Age
              </span>
              <input
                type="number"
                placeholder="18"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
              <span>
                <Scale size={30} color="purple" />
                Weight
              </span>
              <input
                type="number"
                placeholder="25"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
              <span>
                <Target size={30} color="red" />
                Goal
              </span>
              <select
                name="Goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
              >
                <option value="">Select Goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Weight Gain">Weight Gain</option>
                <option value="Maintain Weight">Maintain Weight</option>
              </select>
              <span>
                <Salad size={30} color="green" />
                Diet Type
              </span>
              <select
                name="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Generating..." : "Generate Diet Plan"}
              </button>
            </form>
            <div className="plan">
              {loading ? (
                <p>Generating your personalized diet plan...</p>
              ) : (
                renderDietPlan(plan)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}