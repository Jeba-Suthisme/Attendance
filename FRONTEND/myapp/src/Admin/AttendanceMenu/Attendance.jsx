import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Attendance.module.css";

const Attendance = () => {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState("");
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [filterIntern, setFilterIntern] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

 
  const fetchInterns = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/interns/");
      setInterns(res.data);
    } catch (err) {
      console.error("Error fetching interns", err);
    }
  };

  
  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/attendance/");
      setAttendanceHistory(res.data);
    } catch (err) {
      console.error("Error fetching attendance", err);
    }
  };

  useEffect(() => {
    fetchInterns();
    fetchAttendance();
  }, []);

 
  const markAttendance = async (status) => {
    if (!selectedIntern) {
      alert("Select an intern");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/attendance/mark/", {
        intern_id: selectedIntern,
        status: status,
      });
      fetchAttendance();
    } catch (err) {
      console.error("Error marking attendance", err);
    }
  };

  
  const deleteAttendance = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/attendance/${id}/delete/`
      );
      fetchAttendance();
    } catch (err) {
      console.error("Error deleting attendance", err);
    }
  };


  const downloadAttendance = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/attendance/download/",
        {
          params: {
            intern_id: filterIntern || undefined,
            status: filterStatus || undefined,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading attendance", err);
    }
  };

  return (
    <div className={styles.attendance}>
      <h2>Attendance Management</h2>

      
      <h3>Mark Attendance</h3>
      <select
        value={selectedIntern}
        onChange={(e) => setSelectedIntern(e.target.value)}
      >
        <option value="">Select Intern</option>
        {interns.map((intern) => (
          <option key={intern.id} value={intern.id}>
            {intern.name}
          </option>
        ))}
      </select>

      <button onClick={() => markAttendance("present")}>Present</button>
      <button onClick={() => markAttendance("absent")}>Absent</button>

      
      <h3>Download Attendance</h3>
      <div className={styles.downloadFilters}>
        <select
          value={filterIntern}
          onChange={(e) => setFilterIntern(e.target.value)}
        >
          <option value="">All Interns</option>
          {interns.map((intern) => (
            <option key={intern.id} value={intern.id}>
              {intern.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>

        <button onClick={downloadAttendance}>Download CSV</button>
      </div>

      
      <h3>Attendance History</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Intern Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {attendanceHistory.map((a) => (
            <tr key={a.id}>
              <td>{a.intern_name}</td>
              <td>{a.intern_email}</td>
              <td>{a.date}</td>
              <td>{a.status}</td>
              <td>
                <button onClick={() => deleteAttendance(a.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
