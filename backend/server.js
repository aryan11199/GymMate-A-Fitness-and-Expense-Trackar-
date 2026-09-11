const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "gymmate_secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "aryan",
  database: "GymMate",
});

const JWT_SECRET = "udstyguyds98d98798iudsgjdskkdjhds8698";

//////// USERAUTH API ////////
app.post("/signup", (req, res) => {
  const { username, email, password, age, weight, height, gender } = req.body;

  const sql =
    "INSERT INTO login_info (username, email, password, age, weight, height, gender) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [username, email, password, age, weight, height, gender],
    (err, result) => {
      if (err) {
        console.log("MySQL error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.send({ message: "User registered successfully!" });
    },
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM login_info WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.send(err);

      if (result.length > 0) {
        res.json({
          message: "Login successful",
          user: {
            id: result[0].id,
            username: result[0].username,
            email: result[0].email,
            password: result[0].password,
            role: result[0].role,
            age: result[0].age,
            weight: result[0].weight,
            height: result[0].height,
            gender: result[0].gender,
          },
        });
      } else {
        res.json({ message: "Invalid credentials" });
      }
    },
  );
});

/////Admin site API/////
app.get("/admin/users", (req, res) => {
  db.query(
    "SELECT id, username, email, age, weight, height, gender FROM login_info WHERE role='user'",
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    },
  );
});

app.get("/admin/users/:id", (req, res) => {
  const userId = req.params.id;

  const sql =
    "SELECT id, username, email, role, age, weight, height, gender FROM login_info WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(result[0]); // single user object
  });
});

app.get("/admin/workouts/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query("SELECT * FROM workout WHERE user_id=?", [userId], (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});

app.get("/admin/expenses/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT * FROM transactions WHERE user_id=?",
    [userId],
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    },
  );
});

app.delete("/admin/users/:id", (req, res) => {
  const userId = req.params.id;

  db.query("DELETE FROM workout WHERE user_id = ?", [userId], (err) => {
    if (err) return res.status(500).json(err);

    db.query("DELETE FROM transactions WHERE user_id = ?", [userId], (err) => {
      if (err) return res.status(500).json(err);

      db.query(
        "DELETE FROM login_info WHERE id = ?",
        [userId],
        (err, result) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "User deleted successfully" });
        },
      );
    });
  });
});

//////// Settings API ////////
app.post("/profile", (req, res) => {
  const { name, age, weight, height, step, workout } = req.body;

  const sql =
    "INSERT INTO setting (name, age, weight, height, step, workout ) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [name, age, weight, height, step, workout], (err, result) => {
    if (err) {
      console.log("MySQL error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.json({
      message: "update successful",
      profile: {
        name,
        age,
        weight,
        height,
        step,
        workout,
      },
    });
  });
});

//////// Transactions API ////////
app.post("/transactions", (req, res) => {
  const { amount, category, description, date, type, user_id } = req.body;

  const sql =
    "INSERT INTO transactions ( amount, category, description, date, type, user_id) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [amount, category, description, date, type, user_id],
    (err, result) => {
      if (err) {
        console.log("MySQL error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.json({
        message: "Added successful",
        transactions: {
          amount,
          category,
          description,
          date,
          type,
        },
      });
    },
  );
});

app.get("/transactions", (req, res) => {
  const sql = "SELECT * FROM transactions";

  db.query(sql, (err, results) => {
    if (err) {
      console.log("MySQL error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
});

app.get("/transactions/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
    [userId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    },
  );
});
// Change this to match the frontend call or change the frontend to match this
app.delete("/transactions/:id", (req, res) => {
  const transactionId = req.params.id;

  db.query(
    "DELETE FROM transactions WHERE id = ?",
    [transactionId],
    (err, result) => {
      if (err) {
        console.log("MySQL error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Transaction deleted successfully" });
    },
  );
});

app.put("/transactions/:id", (req, res) => {
  const { amount, category, description, date, type } = req.body;
  const id = req.params.id;
  const sql =
    "UPDATE transactions SET amount=?, category=?, description=?, date=?, type=? WHERE id=?";
  db.query(
    sql,
    [amount, category, description, date, type, id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Update successful" });
    },
  );
});

///////Workout API //////
app.post("/workouts", (req, res) => {
  const { type, intensity, duration, calories, date, note, user_id } = req.body;

  const sql =
    "INSERT INTO workout (type, intensity, duration, calories, date, note, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [type, intensity, duration, calories, date, note, user_id],
    (err) => {
      if (err) {
        console.log("Workout insert error:", err);
        return res.status(500).json(err);
      }

      // Calories Goal Update
      db.query(
        `
        UPDATE goals
        SET progress = IFNULL(progress,0) + ?
        WHERE user_id = ? AND type = 'Calories'
        `,
        [Number(calories), user_id],
      );

      // Workout Count Goal Update
      db.query(
        `
        UPDATE goals
        SET progress = IFNULL(progress,0) + 1
        WHERE user_id = ? AND type = 'Workout'
        `,
        [user_id],
      );

      // Auto-complete goals
      db.query(
        `
        UPDATE goals
        SET achieved = 1
        WHERE user_id = ? AND progress >= target
        `,
        [user_id],
      );

      res.json({ message: "Workout added & goals updated" });
    },
  );
});

// user-wise workouts
app.get("/workouts/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT * FROM workout WHERE user_id = ? ORDER BY date DESC",
    [userId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    },
  );
});

app.delete("/workouts/:id", (req, res) => {
  const workoutId = req.params.id;

  db.query("DELETE FROM workout WHERE id = ?", [workoutId], (err, result) => {
    if (err) {
      console.log("MySQL error", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Workout deleted successfully" });
  });
});

//// STEPS API////
app.post("/steps", (req, res) => {
  const { user_id, step, distance, calories } = req.body;
  const today = new Date().toISOString().split("T")[0];

  db.query(
    "SELECT id FROM steps WHERE user_id=? AND date=?",
    [user_id, today],
    (err, rows) => {
      if (err) return res.status(500).send(err);

      if (rows.length > 0) {
        db.query(
          "UPDATE steps SET step=?, distance=?, calories=? WHERE user_id=? AND date=?",
          [step, distance, calories, user_id, today],
          () => res.json({ message: "Steps updated" }),
        );
      } else {
        db.query(
          "INSERT INTO steps (user_id, date, step, distance, calories) VALUES (?, ?, ?, ?, ?)",
          [user_id, today, step, distance, calories],
          () => res.json({ message: "Steps inserted" }),
        );
      }
    },
  );
});

app.get("/steps/:userId", (req, res) => {
  const userId = req.params.userId;
  const today = new Date().toISOString().split("T")[0];

  db.query(
    "SELECT * FROM steps WHERE user_id=? AND date=?",
    [userId, today],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    },
  );
});

app.get("/exercises/:id", (req, res) => {
  db.query(
    "SELECT * FROM exercises WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log("MySql Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json(result);
    },
  );
});

app.post("/goals", (req, res) => {
  const { title, type, target, unit, user_id } = req.body; // Add user_id

  const sql =
    "INSERT INTO goals (user_id, title, type, target, unit) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [user_id, title, type, target, unit], // Match the order in SQL
    (err, result) => {
      if (err) {
        console.log("MySQL error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({
        message: "Added successful",
        goal: {
          title,
          type,
          target,
          unit,
          user_id,
        },
      });
    },
  );
});

// If you want to get goals by user_id
app.get("/goals/user/:user_id", (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT 
      id, user_id, title, type, target, unit,
      IFNULL(progress, 0) AS progress
    FROM goals 
    WHERE user_id = ?
    ORDER BY createdAt DESC
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.log("MySQL error:", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

app.delete("/goals/:id", (req, res) => {
  const goalId = req.params.id;

  db.query("DELETE FROM goals WHERE id = ?", [goalId], (err, result) => {
    if (err) {
      console.log("MySQL error", err);
      return res.status(500).json(err);
    }
    res.json({ message: "Goal deleted successfully" });
  });
});

app.get("/calories/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT date, SUM(calories) AS totalCalories
    FROM workout
    WHERE user_id = ?
    GROUP BY date
    ORDER BY date
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get("/workouts/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT type, COUNT(*) AS count
    FROM workout
    WHERE user_id = ?
    GROUP BY type
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post("/chat", (req, res) => {
  const { age, weight, goal, dietType, user_id } = req.body; // Add user_id
  const prompt = `
कृपया खालील माहितीसाठी एक सोपी ${dietType} आहार योजना (diet plan) तयार करा:
वय: ${age} वर्षे
वजन: ${weight} किलो
ध्येय: ${goal}
फक्त खालील स्वरूपात संक्षिप्त आहार योजना आणि उष्मांक (calories) द्या. कोणताही अतिरिक्त मजकूर किंवा स्पष्टीकरण देऊ नका.
Format exactly like this:
नाश्ता: (calories)
- पदार्थ १
- पदार्थ २
दुपारचे जेवण: (calories)
- पदार्थ १
- पदार्थ २
स्नॅक्स: (calories)
- पदार्थ १
रात्रीचे जेवण: (calories)
- पदार्थ १
- पदार्थ २
एकूण दैनिक उष्मांक: X kcal
`;
  axios
    .post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    .then((response) => {
      const text = response.data.candidates[0].content.parts[0].text;
      const sql =
        "INSERT INTO diet_plans (user_id, age, weight, goal, diet_type, plan_content) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(
        sql,
        [user_id, age, weight, goal, dietType, text],
        (err, result) => {
          if (err) {
            console.log("Error saving diet plan:", err);
          }
        },
      );
      res.json({
        success: true,
        dietPlan: text,
      });
    })
    .catch((error) => {
      console.error("Gemini Error:", error.response?.data || error.message);
      res.status(500).json({
        success: false,
        error: error.response?.data?.error?.message || "Gemini API error",
      });
    });
});

app.get("/diet-plan/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT * FROM diet_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
    [userId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result[0] || null);
    },
  );
});

// Get all diet plans for a user
app.get("/diet-plans/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT * FROM diet_plans WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    },
  );
});

// ================= GOOGLE AUTH =================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      db.query(
        "SELECT id FROM login_info WHERE email = ?",
        [email],
        (err, result) => {
          if (err) return done(err);

          if (result.length === 0) {
            return done(null, false);
          }
          return done(null, {
            id: result[0].id,
            googleUserId: profile.id,
            accessToken,
          });
        },
      );
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
// Start Google Login
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/fitness.activity.read",
    ],
    prompt: "select_account",
  }),
);

// Google Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/dashboard?error=auth_failed",
  }),
  (req, res) => {
    const userId = req.user.id;
    const googleUserId = req.user.googleUserId;
    const accessToken = req.user.accessToken;

    console.log("✅ Google OAuth successful for user:", userId);

    db.query(
      `
      INSERT INTO google_tokens (user_id, google_user_id, access_token)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE access_token = ?, updated_at = NOW()
      `,
      [userId, googleUserId, accessToken, accessToken],
      (err) => {
        if (err) {
          console.error("❌ Token save error:", err);
          return res.redirect(
            "http://localhost:3000/dashboard?error=token_save_failed",
          );
        }

        console.log("✅ Token saved successfully");
        res.redirect("http://localhost:3000/dashboard?connected=true");
      },
    );
  },
);

// ===== GOOGLE FIT STEPS API =====
app.get("/google-fit/steps", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
  const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime();

  axios
    .post(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      {
        aggregateBy: [
          {
            dataTypeName: "com.google.step_count.delta",
          },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: startOfDay,
        endTimeMillis: endOfDay,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((response) => {
      let totalSteps = 0;
      response.data.bucket.forEach((bucket) => {
        bucket.dataset.forEach((dataset) => {
          dataset.point.forEach((point) => {
            totalSteps += point.value[0].intVal || 0;
          });
        });
      });

      console.log("✅ Today's steps:", totalSteps);
      res.json({ steps: totalSteps });
    })
    .catch((err) => {
      console.error("Google Fit Error:", err.response?.data || err.message);
      res.status(500).json({ error: "Failed to fetch steps" });
    });
});

app.get("/google-fit/token/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT access_token FROM google_tokens WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ connected: false });

      if (result.length === 0) {
        return res.json({ connected: false });
      }

      res.json({
        connected: true,
        token: result[0].access_token,
      });
    },
  );
});

app.get("/google-fit/sync-steps/:userId", async (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT access_token FROM google_tokens WHERE user_id = ?",
    [userId],
    async (err, tokenResult) => {
      if (err || !tokenResult.length)
        return res.status(404).json({ error: "Token not found" });

      const token = tokenResult[0].access_token;
      const daysToFetch = 7;
      const savedDays = [];

      for (let i = 0; i < daysToFetch; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        // ✅ Proper Local Date Format (YYYY-MM-DD)
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const startOfDay = new Date(d.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = startOfDay + 86399999;

        try {
          const response = await axios.post(
            "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
            {
              aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
              bucketByTime: { durationMillis: 86400000 },
              startTimeMillis: startOfDay,
              endTimeMillis: endOfDay,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          let daySteps = 0;
          if (response.data.bucket) {
            response.data.bucket.forEach((b) =>
              b.dataset.forEach((d) =>
                d.point.forEach((p) => {
                  daySteps += p.value[0].intVal || 0;
                }),
              ),
            );
          }

          const distance = ((daySteps * 0.762) / 1000).toFixed(2);
          const calories = Math.round(daySteps * 0.04);

          // ✅ Sequential DB Query
          await new Promise((resolve, reject) => {
            db.query(
              `INSERT INTO steps (user_id, date, step, distance, calories) 
                         VALUES (?, ?, ?, ?, ?)
                         ON DUPLICATE KEY UPDATE step = VALUES(step), distance = VALUES(distance), calories = VALUES(calories)`,
              [userId, dateStr, daySteps, distance, calories],
              (dbErr) => (dbErr ? reject(dbErr) : resolve()),
            );
          });

          console.log(`✅ Synced: ${dateStr} - ${daySteps} steps`);
          savedDays.push({ date: dateStr, steps: daySteps });
        } catch (error) {
          console.error(`❌ Error for ${dateStr}:`, error.message);
        }
      }
      res.json({ success: true, message: "7 Days Synced", data: savedDays });
    },
  );
});

app.get("/steps/all/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query(
    "SELECT * FROM steps WHERE user_id = ? ORDER BY date ASC LIMIT 30",
    [userId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    },
  );
});

app.get("/", (req, res) => {
  res.send("GymMate Backend Running ✅");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
