import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      const res = await axios.post("http://127.0.0.1:8000/apilogin/login/", {
        email,
        password
      });

     
      localStorage.setItem("token", res.data.token); 
      localStorage.setItem("role", res.data.role);

      
      if (res.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/intern-dashboard");
      }

    } catch (err) {
      console.error(err);
      setMessage("Invalid credentials");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
