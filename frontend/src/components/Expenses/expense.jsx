import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./expense.css";
import { Wallet, Target, Receipt } from "lucide-react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AddTransaction from "./addTransaction";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Expense() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [isopen, setIsOpen] = useState(false);

  const categories = [
    "Gym Membership",
    "Equipment",
    "Supplement",
    "Diet&Nutrition",
    "Trainer Fees",
    "Salary",
    "Freelance",
    "Investments",
    "Other",
  ];

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`http://localhost:3001/transactions/${user.id}`)
        .then((res) => {
          setTransactions(res.data);
        })
        .catch((err) => console.error("Error fetching transactions:", err));
    }
  }, []);

  useEffect(() => {
    let income = 0;
    let expense = 0;
    let categoryMap = {};

    transactions.forEach((t) => {
      const amount = Number(t.amount);
      if (t.type === "Income") {
        income += amount;
      } else if (t.type === "Expense") {
        expense += amount;
        categoryMap[t.category] = (categoryMap[t.category] || 0) + amount;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setTotalBalance(income - expense);
    setCategoryTotals(categoryMap);
  }, [transactions]);

  const charData = {
    labels: categories,
    datasets: [
      {
        label: "Expense by Category",
        data: categories.map((cat) => categoryTotals[cat] || 0),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6C0C",
          "#FF6Ca2",
          "#6CFFB3",
        ],
        borderRadius: 5,
      },
    ],
  };

  const charOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Space vachvnyasathi label hide kela ahe
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="main">
      <div className="expense">
        <div className="expense_head">
          <h1>Expenses</h1>
          <div className="transaction_add">
            <a onClick={() => navigate("/dashboard/transactions")}>View All</a>
            <a onClick={() => setIsOpen(true)}>+ Add Transaction</a>
          </div>
        </div>

        {/* Modal Component */}
        <AddTransaction isOpen={isopen} onClose={() => setIsOpen(false)} />

        <div className="expense_body">
          {/* Top Cards Section */}
          <div className="expense_body1">
            <div className="expense_card">
              <div className="ex-head">
                <h3>Total Balance</h3>
                <Wallet size={24} />
              </div>
              <div className="ex-amount">
                <h4>₹{totalBalance}</h4>
                <p>Available funds</p>
              </div>
            </div>

            <div className="expense_card">
              <div className="ex-head1">
                <h3>Total Income</h3>
                <Target size={24} />
              </div>
              <div className="ex-amount">
                <h4 style={{ color: "#0046ff" }}>₹{totalIncome}</h4>
                <p>This Month</p>
              </div>
            </div>

            <div className="expense_card">
              <div className="ex-head2">
                <h3>Total Expense</h3>
                <Receipt size={24} />
              </div>
              <div className="ex-amount">
                <h4 style={{ color: "#ff6c0c" }}>₹{totalExpense}</h4>
                <p>This Month</p>
              </div>
            </div>
          </div>

          {/* Recent & Chart Section */}
          <div className="expense_body3">
            <div className="Recent">
              <h3>Recent Transactions</h3>
              <div className="transaction_list">
                {transactions.length === 0 ? (
                  <p style={{ padding: "20px", textAlign: "center" }}>
                    No transactions yet.
                  </p>
                ) : (
                  transactions
                    .slice()
                    .reverse()
                    .slice(0, 7)
                    .map((t, index) => (
                      <li key={index}>
                        <span>{t.category}</span>
                        <span
                          style={{
                            color: t.type === "Income" ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {t.type === "Income" ? "+" : "-"} ₹{t.amount}
                        </span>
                      </li>
                    ))
                )}
              </div>
            </div>

            <div className="expense_chart">
              <h3>Expense Analytics</h3>
              <div className="chart_container">
                <Bar data={charData} options={charOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
