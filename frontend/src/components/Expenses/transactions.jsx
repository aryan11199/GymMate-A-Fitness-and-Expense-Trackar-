import React, { useState, useEffect } from "react";
import "./transactions.css";
import axios from "axios";
import AddTransaction from "./addTransaction";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null); 
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchTransactions = () => {
    if (user.id) {
      axios
        .get(`http://localhost:3001/transactions/${user.id}`)
        .then((res) => setTransactions(res.data))
        .catch((err) => console.log("Fetch Error:", err));
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user.id]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      axios
        .delete(`http://localhost:3001/transactions/${id}`)
        .then(() => {
          setTransactions(transactions.filter((t) => t.id !== id));
          alert("Deleted!");
        })
        .catch((err) => alert("Delete failed"));
    }
  };

  // Open modal for EDIT
  const handleEdit = (transaction) => {
    setEditData(transaction); // Pass the clicked row data
    setIsModalOpen(true);
  };

  // Open modal for ADD
  const handleAddNew = () => {
    setEditData(null); // Ensure form is empty for new entry
    setIsModalOpen(true);
  };

  return (
    <div className="transactions_head">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Your Transactions</h1>
        <button className="add_new_btn" onClick={handleAddNew}>+ Add New</button>
      </div>

      <div className="table_container">
        <table>
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={transaction.id || index}>
                  <td>{index + 1}</td>
                  <td>{transaction.category}</td>
                  <td className={transaction.type === "Income" ? "come" : "out"}>
                    ₹{transaction.amount}
                  </td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.type}</td>
                  <td>
                    <button className="edit_btn" onClick={() => handleEdit(transaction)}>Edit</button>
                    <button className="delete_btn" onClick={() => handleDelete(transaction.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>No transactions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* REUSED MODAL COMPONENT */}
      <AddTransaction 
        isOpen={isModalOpen} 
        editData={editData} 
        onClose={(shouldRefresh) => {
          setIsModalOpen(false);
          if (shouldRefresh === true) fetchTransactions(); // Refresh table after update
        }} 
      />
    </div>
  );
}