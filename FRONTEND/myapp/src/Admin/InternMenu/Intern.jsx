import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Intern.module.css";

const Interns = () => {
  const [interns, setInterns] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const ADMIN_TOKEN = "302fa18b3e95042e1ad756a1e11c6bda47add616";

 
  const fetchInterns = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/interns/", {
        headers: {
          Authorization: `Token ${ADMIN_TOKEN}`,
        },
      });
      setInterns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/interns/add/",
        form,
        {
          headers: {
            Authorization: `Token ${ADMIN_TOKEN}`,
          },
        }
      );
      setForm({ name: "", email: "", password: "" });
      setMessage("Intern added successfully");
      fetchInterns();
    } catch (err) {
      console.error(err);
      setMessage("Failed to add intern");
    }
  };

 
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this intern?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/interns/${id}/delete/`,
        {
          headers: {
            Authorization: `Token ${ADMIN_TOKEN}`,
          },
        }
      );
      fetchInterns();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

 
  const downloadInterns = () => {
    window.open(
      "http://127.0.0.1:8000/api/interns/download/",
      "_blank"
    );
  };

  return (
    <div className={styles.interns}>
      <h2>Intern Management</h2>

      
      <form onSubmit={handleAdd} className={styles.form}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Add Intern</button>
      </form>

      {message && <p>{message}</p>}

      
      <button onClick={downloadInterns} className={styles.downloadBtn}>
        Download Intern List
      </button>

      
      <table className={styles.table}>
        <thead>
          <tr>
            <th>SI NO</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {interns.map((i, index) => (
            <tr key={i.id}>
              <td>{index + 1}</td>
              <td>{i.name}</td>
              <td>{i.email}</td>
              <td>
                <button
                  onClick={() => handleDelete(i.id)}
                  className={styles.deleteBtn}
                >
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

export default Interns;
