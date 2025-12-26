import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./IDashboard.module.css";

const IDashboard = () => {
  const [profile, setProfile] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
const TOKEN = localStorage.getItem("token");

const fetchProfile = async () => {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/apilogin/profile/",
      {
        headers: {
          Authorization: `Token ${TOKEN}`,
        },
      }
    );
    setProfile(res.data);
  } catch (err) {
    console.error("Error fetching profile:", err);
  } finally {
    setLoading(false);  
  }
};


  
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/apilogin/attendance/",
        {
          headers: { Authorization: `Token ${TOKEN}` },
        }
      );
      setAttendance(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setMessage("Failed to fetch attendance.");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAttendance();
  }, []);

  
  const markAttendance = async (status) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/apilogin/attendance/mark/",
        { status },
        { headers: { Authorization: `Token ${TOKEN}` } }
      );
      setMessage(`Marked as ${status}`);
      fetchAttendance();
    } catch (err) {
      console.error(err);
      setMessage("Attendance already marked today or error occurred.");
    }
  };

  
const downloadAttendance = async () => {
  const res = await axios.get(
    "http://127.0.0.1:8000/apilogin/attendance/download/",
    {
      headers: {
        Authorization: `Token ${TOKEN}`,
      },
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Intern_attendance.csv");
  document.body.appendChild(link);
  link.click();
};


  
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className={styles.container}>
      <h2>Welcome Intern</h2>

      <div className={styles.profile}>
        <p><b>Name:</b> {profile.name}</p>
        <p><b>Email:</b> {profile.user_email}</p>
        <p><b>Role:</b> {profile.role}</p>
      </div>

      <div className={styles.buttons}>
        <h3>Mark Attendance</h3>
        <button onClick={() => markAttendance("present")}>Present</button>
        <button onClick={() => markAttendance("absent")}>Absent</button>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      <h3>Attendance History</h3>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 0" }}>
        <button onClick={downloadAttendance}>Download Attendance</button>
        <button
          onClick={handleLogout}
          style={{ backgroundColor: "red", color: "#fff", textAlign: "center" }}
        >
          Logout
        </button>
      </div>

      <table className={styles.table} style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.length === 0 ? (
            <tr>
              <td colSpan="2">No attendance history</td>
            </tr>
          ) : (
            attendance.map((a) => (
              <tr key={a.id}>
                <td>{a.date}</td>
                <td>{a.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IDashboard;
