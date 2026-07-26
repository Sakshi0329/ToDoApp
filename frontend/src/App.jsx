import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ToDoApp from "./components/ToDoApp";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (profile) => {
    setUser(profile);
  };

  const handleSignup = (profile) => {
    setUser(profile);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar user={user} logout={logout} />

      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/signup" />
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Signup onSignup={handleSignup} />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={user ? <ToDoApp user={user} /> : <Navigate to="/signup" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
