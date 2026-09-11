import React, { useState, useEffect } from "react";
import "./addTransaction.css";
import axios from "axios";

export default function AddTransaction({ isOpen, onClose, editData }) {
  const [Type, setType] = useState("");
  const [Amount, setAmount] = useState("");
  const [Category, setCategory] = useState("");
  const [Description, setDescription] = useState("");
  const [Date, setDate] = useState("");

  useEffect(() => {
    if (editData) {
      setType(editData.type);
      setAmount(editData.amount);
      setCategory(editData.category);
      setDescription(editData.description);
      const formattedDate = editData.date ? editData.date.split('T')[0] : "";
      setDate(formattedDate);
    } else {
      setType("");
      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");
    }
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!Amount || !Category || !Description || !Date || !Type) {
      alert("Please fill all fields.");
      return;
    }

    const transactionData = {
      amount: Amount,
      category: Category,
      description: Description,
      date: Date,
      type: Type,
      user_id: JSON.parse(localStorage.getItem("user")).id,
    };

    const apiCall = editData 
      ? axios.put(`http://localhost:3001/transactions/${editData.id}`, transactionData)
      : axios.post("http://localhost:3001/transactions", transactionData);

    apiCall
      .then((res) => {
        alert(editData ? "Updated Successfully!" : "Added Successfully!");
        onClose(true); 
      })
      .catch((err) => console.log(err));
  };

  if (!isOpen) return null;

  return (
    <div className="transaction">
      <div className="transaction-container">
        <div className="transaction-header">
          <h1>{editData ? "Edit Transaction" : "Add Transaction"}</h1>
          <span className="close" onClick={() => onClose(false)}>×</span>
        </div>
        
        <div className="transactions_type">
          <label>
            <input type="radio" checked={Type === "Expense"} onChange={() => setType("Expense")} /> Expense
          </label>
          <label>
            <input type="radio" checked={Type === "Income"} onChange={() => setType("Income")} /> Income
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="number" placeholder="₹Amount" value={Amount} onChange={(e) => setAmount(e.target.value)} required />
          <select value={Category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option>Gym Membership</option>
            <option>Equipment</option>
            <option>Supplement</option>
            <option>Diet&Nutrition</option>
            <option>Trainer Fees</option>
            <option>Salary</option>
            <option>Freelance</option>
            <option>Investments</option>
            <option>Other</option>
          </select>
          <input type="text" placeholder="Description" value={Description} onChange={(e) => setDescription(e.target.value)} required />
          <input type="date" value={Date} onChange={(e) => setDate(e.target.value)} required />
          
          <button type="submit">
            {editData ? "UPDATE" : "+ADD"}
          </button>
        </form>
      </div>
    </div>
  );
}