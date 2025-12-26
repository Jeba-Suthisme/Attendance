import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../Login/Login";

import ADashboard from '../Admin/Adashboard/Adashboard'

import IDashboard from "../Intern/IDashboard";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/admin-dashboard" element={<ADashboard />} />
      <Route path="/intern-dashboard" element={<IDashboard />} />

      
    </Routes>
  );
};

export default AppRouter;
