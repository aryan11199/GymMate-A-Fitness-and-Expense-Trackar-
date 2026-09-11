import axios from "axios";
import { useState, useEffect } from "react";
import "./report.css";
import { Wallet, Clock3, Flame, Dumbbell } from "lucide-react";
import jspdf from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const [users, setUsers] = useState([]);
  const [userId, setUsersId] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:3001/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const genrateReport = async () => {
    if (!userId) {
      alert("Please select user");
      return;
    }
    try {
      const [wRes, eRes] = await Promise.all([
        axios.get(`http://localhost:3001/admin/workouts/${userId}`),
        axios.get(`http://localhost:3001/admin/expenses/${userId}`),
      ]);

      let wData = wRes.data;
      let eData = eRes.data;

      if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        wData = wData.filter((w) => {
          const d = new Date(w.date);
          return d >= fromDate && d <= toDate;
        });
        eData = eData.filter((e) => {
          const d = new Date(e.date);
          return d >= fromDate && d <= toDate;
        });
      }

      setWorkouts(wData);
      setExpenses(eData);
      setCurrentPage(1);
    } catch (err) {
      console.log(err);
    }
  };

  const totalCalories = workouts.reduce(
    (acc, w) => acc + Number(w.calories || 0),
    0,
  );
  const totalDuration = workouts.reduce(
    (acc, w) => acc + Number(w.duration || 0),
    0,
  );
  const totalExpense = expenses.reduce(
    (acc, e) => acc + Number(e.amount || 0),
    0,
  );

  const reportRows = [
    ...workouts.map((w) => ({
      date: w.date,
      type: "Workout",
      category: w.type,
      value: w.calories,
    })),
    ...expenses.map((e) => ({
      date: e.date,
      type: "Expense",
      category: e.type,
      value: e.amount,
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalPages = Math.ceil(reportRows.length / rowsPerPage);
  const paginatedRows = reportRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const generatePDF = () => {
    if (!userId) return alert("Select a user first");
    const selectedUser = users.find((u) => String(u.id) === String(userId));
    const doc = new jspdf();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("GymMate - User Report", 14, 15);

    // User Details in Column Format
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Y-axis 25 pasun start karun pratyek line la 7-8 points ne khali sarka
    doc.text(`User Name : ${selectedUser?.username}`, 14, 25);
    doc.text(`Age       : ${selectedUser?.age}`, 14, 32);
    doc.text(`Gender    : ${selectedUser?.gender}`, 14, 39);
    doc.text(`Height    : ${selectedUser?.height} cm`, 14, 46);
    doc.text(`Weight    : ${selectedUser?.weight} kg`, 14, 53);

    // Period and Summary
    doc.setFont(undefined, "bold");
    doc.text(`Report Period: ${from || "Start"} to ${to || "End"}`, 14, 65);
    doc.setFont(undefined, "normal");

    // Table
    autoTable(doc, {
      startY: 70, // Table thoda khali start hoil karan details column madhe ahet
      head: [["Date", "Type", "Category", "Value"]],
      body: reportRows.map((r) => [
        new Date(r.date).toLocaleDateString(),
        r.type,
        r.category,
        r.value,
      ]),
      headStyles: { fillColor: [6, 80, 182] }, // Tuzya button sarkha blue color
    });

    doc.save(`${selectedUser?.username}_report.pdf`);
  };

  return (
    <div className="report">
      <div className="report-head">
        <div className="report-head1">
          <h1>Reports</h1>
        </div>
        <div className="Line"></div>
        <div className="report-head2">
          <div className="select">
            <label>User:</label>
            <br />
            <select value={userId} onChange={(e) => setUsersId(e.target.value)}>
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
          <div className="date">
            <div>
              From:
              <br />
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div>
              To:
              <br />
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
          <button className="gen-bt" onClick={genrateReport}>
            Generate Report
          </button>
        </div>
      </div>

      <div className="report1">
        <div className="report-card">
          <div className="re-card1" style={{ backgroundColor: "#e0f2fe" }}>
            <h3>
              <Dumbbell size={32} color="#0369a1" /> Total Workouts:{" "}
              {workouts.length}
            </h3>
          </div>
          <div className="re-card1" style={{ backgroundColor: "#fef3c7" }}>
            <h3>
              <Flame size={32} color="#b45309" /> Calories: {totalCalories}
            </h3>
          </div>
          <div className="re-card1" style={{ backgroundColor: "#dcfce7" }}>
            <h3>
              <Clock3 size={32} color="#15803d" /> Duration: {totalDuration}m
            </h3>
          </div>
          <div className="re-card1" style={{ backgroundColor: "#fee2e2" }}>
            <h3>
              <Wallet size={32} color="#b91c1c" /> Expenses: ₹{totalExpense}
            </h3>
          </div>
        </div>

        <div className="report-table">
          <div className="report2">
            <h2>Report Details</h2>
            <div className="change">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>
              <span>
                {currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((r, i) => (
                  <tr key={i}>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.type}</td>
                    <td>{r.category}</td>
                    <td>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reportRows.length > 0 && (
            <button
              className="gen-bt"
              style={{ marginTop: "20px" }}
              onClick={generatePDF}
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
