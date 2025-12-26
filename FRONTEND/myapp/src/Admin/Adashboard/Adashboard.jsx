import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Interns from "../InternMenu/Intern"; 
import Attendance from "../AttendanceMenu/Attendance"; 
import styles from "./Adashboard.module.css";

const ADashboard = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("interns"); 

  const handleLogout = () => {
    
    localStorage.removeItem("user"); 
    navigate("/login"); 
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h2>Welcome, {user?.name || "Admin"}</h2>
        <button onClick={handleLogout} className={styles.logout}>
          Logout
        </button>
      </header>

      <nav className={styles.navbar}>
        <button
          className={activeTab === "interns" ? styles.active : ""}
          onClick={() => setActiveTab("interns")}
        >
          Interns
        </button>
        <button
          className={activeTab === "attendance" ? styles.active : ""}
          onClick={() => setActiveTab("attendance")}
        >
          Attendance
        </button>
      </nav>

      <main className={styles.content}>
        {activeTab === "interns" && <Interns />}
        {activeTab === "attendance" && <Attendance />}
      </main>
    </div>
  );
};

export default ADashboard;
