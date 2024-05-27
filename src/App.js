import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./screens/Login";
import AdminView from "./components/AdminView";
import UserView from "./components/UserView";
import { getAuth } from "firebase/auth";

const auth = getAuth();

function App() {
  const user = auth.currentUser;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? (user.rol === "Administrador" ? "/admin" : "/user") : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/user" element={<UserView />} />
      </Routes>
    </Router>
  );
}

export default App;
