import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Intern.module.css";

const Interns = () => {
  const [interns, setInterns] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editIntern, setEditIntern] = useState(null);
  const [message, setMessage] = useState("");

  const ADMIN_TOKEN = "302fa18b3e95042e1ad756a1e11c6bda47add616";

  
  const fetchInterns = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/interns/", {
        headers: { Authorization: `Token ${ADMIN_TOKEN}` },
      });
      setInterns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editIntern) {
        
        await axios.patch(
          `http://127.0.0.1:8000/api/interns/${editIntern.id}/edit/`,
          form,
          {
            headers: { Authorization: `Token ${ADMIN_TOKEN}` },
          }
        );
        setMessage("Intern updated successfully");
      } else {
        
        await axios.post(
          "http://127.0.0.1:8000/api/interns/add/",
          form,
          {
            headers: { Authorization: `Token ${ADMIN_TOKEN}` },
          }
        );
        setMessage("Intern added successfully");
      }

      setForm({ name: "", email: "", password: "" });
      setEditIntern(null);
      fetchInterns();
    } catch (err) {
      console.error(err);
      setMessage("Operation failed");
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this intern?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/interns/${id}/delete/`,
        {
          headers: { Authorization: `Token ${ADMIN_TOKEN}` },
        }
      );
      fetchInterns();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

 
  const handleEdit = (intern) => {
    setEditIntern(intern);
    setForm({
      name: intern.name,
      email: intern.email,
      password: "", 
    });
  };

 
  const downloadInterns = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/interns/download/",
      {
        headers: {
          Authorization: `Token ${ADMIN_TOKEN}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "interns.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download failed", error);
  }
};


  return (
    <div className={styles.interns}>
      <h2>Intern Management</h2>

      
      <form onSubmit={handleSubmit} className={styles.form}>
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
          placeholder="Password "
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">
          {editIntern ? "Update Intern" : "Add Intern"}
        </button>

        {editIntern && (
          <button
            type="button"
            onClick={() => {
              setEditIntern(null);
              setForm({ name: "", email: "", password: "" });
            }}
          >
            Cancel
          </button>
        )}
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
                  onClick={() => handleEdit(i)}
                  className={styles.editBtn}
                >
                  Edit
                </button>

                <button
                  style={{ marginLeft: "10px" }}
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
