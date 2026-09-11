import React, { useEffect, useState } from "react";
import axios from "axios";
import "./activity.css";

export default function Activity() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);

  const usersPerPage = 5;
  const workoutPerPage = 5;
  const expensePerPage = 5;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const currentworkouts = workouts.slice(
    (currentPage1 - 1) * workoutPerPage,
    currentPage1 * workoutPerPage,
  );
  const currentexpenses = expenses.slice(
    (currentPage2 - 1) * expensePerPage,
    currentPage2 * expensePerPage,
  );

  useEffect(() => {
    axios
      .get("http://localhost:3001/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleview = (user) => {
    setSelectedUser(user);
    setCurrentPage1(1);
    setCurrentPage2(1);
    axios
      .get(`http://localhost:3001/admin/workouts/${user.id}`)
      .then((res) => setWorkouts(res.data));
    axios
      .get(`http://localhost:3001/admin/expenses/${user.id}`)
      .then((res) => setExpenses(res.data));
  };

  const hadleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`http://localhost:3001/admin/users/${id}`).then(() => {
        setUsers(users.filter((u) => u.id !== id));
      });
    }
  };

  return (
    <div className="Main">
      <div className="activity">
        <div className="activity-table">
          <h1>Activity Dashboard</h1>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleview(user)}
                      >
                        View
                      </button>
                      <button
                        className="del-btn"
                        onClick={() => hadleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(users.length / usersPerPage)}
            >
              Next
            </button>
          </div>
        </div>

        {selectedUser && (
          <div className="user-details">
            <div className="line"></div>
            <h2>Details for {selectedUser.username}</h2>
            <div className="user-details1">
              <span>
                <b>Age:</b> {selectedUser.age}
              </span>
              <span>
                <b>Gender:</b> {selectedUser.gender}
              </span>
              <span>
                <b>Height:</b> {selectedUser.height}
              </span>
              <span>
                <b>Weight:</b> {selectedUser.weight}
              </span>
            </div>

            <div className="user-detatils2">
              <div className="activity1">
                <h3>Workouts</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Intensity</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentworkouts.map((w) => (
                        <tr key={w.id}>
                          <td>{w.type}</td>
                          <td>{w.duration}</td>
                          <td>{w.intensity}</td>
                          <td>{new Date(w.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage1(currentPage1 - 1)}
                    disabled={currentPage1 === 1}
                  >
                    Prev
                  </button>
                  <span>{currentPage1}</span>
                  <button
                    onClick={() => setCurrentPage1(currentPage1 + 1)}
                    disabled={
                      currentPage1 >=
                      Math.ceil(workouts.length / workoutPerPage)
                    }
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="activity2">
                <h3>Expenses</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentexpenses.map((e) => (
                        <tr key={e.id}>
                          <td>{e.type}</td>
                          <td>{e.amount}</td>
                          <td>{new Date(e.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage2(currentPage2 - 1)}
                    disabled={currentPage2 === 1}
                  >
                    Prev
                  </button>
                  <span>{currentPage2}</span>
                  <button
                    onClick={() => setCurrentPage2(currentPage2 + 1)}
                    disabled={
                      currentPage2 >=
                      Math.ceil(expenses.length / expensePerPage)
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
