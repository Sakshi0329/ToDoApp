import React, { useState } from "react";
import { loginStyles } from "../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = ({ onLogin, BASE_URL = import.meta.env.VITE_API_URL }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const fetchProfile = async (token) => {
    if (!token) return null;
    const res = await axios.get(`${BASE_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };
  const persisAuth = (profile, token) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    try {
      if (token) storage.setItem("token", token);
      if (profile) storage.setItem("user", JSON.stringify(profile));
    } catch (err) {
      console.error("Storage Error", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${BASE_URL}/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );
      const data = res.data || {};
      const token = data.token || null;

      let profile = data.user ?? null;
      if (!profile) {
        const copy = { ...data };
        delete copy.token;
        delete copy.user;
        if (Object.keys(copy).length) {
          profile = copy;
        }
      }
      if (!profile && token) {
        try {
          profile = await fetchProfile(token);
        } catch (fetchErr) {
          console.warn("Could not fetch profile after login token:", fetchErr);
          profile = { email };
        }
      }
      if (!profile) profile = { email };
      persisAuth(profile, token);

      if (typeof onLogin === "function") {
        onLogin(profile, rememberMe, token);
      }

      navigate("/dashboard");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err?.response || err);
      const serverMsg =
        err.response?.data?.message ||
        (err.response?.data ? JSON.stringify(err.response.data) : null) ||
        err.message ||
        "Login failed";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div
        className={`min-h-screen flex items-start justify-center pt-10 px-4 
 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
      >
        <div
          className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transition-all duration-300
 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
        >
          <div
            className={`relative text-center px-4 pt-4 pb-2 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gradient-to-r from-teal-500 to-emerald-600 text-gray-900"}`}
          >
            {" "}
            <div className={loginStyles.avatar}>
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className={loginStyles.headerTitle}>Welcome Back</h1>
            <p className={loginStyles.headerSubtitle}></p>
          </div>
          <div className={loginStyles.formContainer}>
            {error && (
              <div className={loginStyles.errorContainer}>
                <div className={loginStyles.errorIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className={loginStyles.errorText}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className={`${
                    theme === "dark" ? "text-white" : "text-gray-700"
                  } font-medium mb-2 block`}
                >
                  Email Address
                </label>
                <div className={loginStyles.inputContainer}>
                  <div className={loginStyles.inputIcon}>
                    <Mail className="w-5 h-5 " />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={loginStyles.input}
                    placeholder="your@example.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className={`${
                    theme === "dark" ? "text-white" : "text-gray-700"
                  } font-medium mb-2 block`}
                >
                  Password
                </label>
                <div className={loginStyles.inputContainer}>
                  <div className={loginStyles.inputIcon}>
                    <Lock className="w-5 h-5 " />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={loginStyles.passwordInput}
                    placeholder="******"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={loginStyles.passwordToggle}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div
                className={`${loginStyles.checkboxContainer} flex items-center gap-2`}
              >
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={loginStyles.checkbox}
                  required
                />

                <label
                  htmlFor="remember"
                  className={`${theme === "dark" ? "text-white" : "text-gray-700"} text-sm`}
                >
                  Remember Me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
    w-full py-3 mt-2 rounded-xl font-semibold text-white
    transition-all duration-300 shadow-lg
    ${
      theme === "dark"
        ? "bg-gray-700 hover:bg-gray-600"
        : "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
    }
    ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
  `}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <div className={loginStyles.signUpContainer}>
              <p
                className={`${
                  theme === "dark" ? "text-white" : "text-gray-700"
                } text-sm`}
              >
                Don't have an account?{" "}
                <Link to="/signup" className={loginStyles.signUpLink}>
                  Create One
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
