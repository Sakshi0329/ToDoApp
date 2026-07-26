import React, { useState } from "react";
import { signupStyles } from "../assets/dummyStyles";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import axios from "axios";
import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

const Signup = ({ BASE_URL = import.meta.env.VITE_API_URL, onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
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

  const persistAuth = (profile, token) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    try {
      if (token) storage.setItem("token", token);
      if (profile) storage.setItem("user", JSON.stringify(profile));
    } catch (err) {
      console.error("Storage Error", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/user/register`,
        { name, email, password },
        { headers: { "Content-Type": "application/json" } },
      );
      const data = res.data || {};
      const token = data.token ?? null;
      let profile = data.user ?? null;
      if (!profile) {
        // check for any extra fields returned that could be user info
        const copy = { ...data };
        delete copy.token;
        delete copy.user;
        if (Object.keys(copy).length) profile = copy;
      }

      if (!profile && token) {
        try {
          profile = await fetchProfile(token);
        } catch (fetchErr) {
          console.warn("Could not fetch profile after signup token:", fetchErr);
          profile = null;
        }
      }

      if (!profile) profile = { name, email };
      persistAuth(profile, token);
      if (typeof onSignup === "function") {
        try {
          onSignup(profile, rememberMe, token);
        } catch (callErr) {
          console.warn("onSignup threw:", callErr);
        }
      }

      navigate("/dashboard");
      setPassword("");
    } catch (err) {
      console.error("Signup error:", err?.response || err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ api: err.response.data.message });
      } else {
        setErrors({ api: err.message || "An unexpected error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div
        className={`min-h-screen flex items-center justify-center p-4 
 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
      >
        <div
          className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transition-all duration-300
 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
        >
          <div
            className={`relative text-center px-4 pt-4 pb-2 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gradient-to-r from-teal-500 to-emerald-600 text-gray-900"}`}
          >
            <button
              onClick={() => navigate(-1)}
              className={signupStyles.backButton}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={signupStyles.avatar}>
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className={signupStyles.headerTitle}>Create Account</h1>
            <p className={signupStyles.headerSubtitle}></p>
          </div>
          <div className={signupStyles.formContainer}>
            {errors.api && (
              <p className={signupStyles.apiError}>{errors.api}</p>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className={`${
                    theme === "dark" ? "text-white" : "text-gray-700"
                  } font-medium mb-2 block`}
                >
                  Full Name
                </label>
                <div className={signupStyles.inputContainer}>
                  <div className={signupStyles.inputIcon}>
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${signupStyles.input}${errors.name ? "border-red-300" : "border-gray-200"}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className={signupStyles.fieldError}>{errors.name}</p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className={`${
                    theme === "dark" ? "text-white" : "text-gray-700"
                  } font-medium mb-2 block`}
                >
                  Email Address
                </label>
                <div className={signupStyles.inputContainer}>
                  <div className={signupStyles.inputIcon}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${signupStyles.input}${errors.email ? "border-red-300" : "border-gray-200"}`}
                    placeholder="your@example.com"
                  />
                </div>
                {errors.email && (
                  <p className={signupStyles.fieldError}>{errors.email}</p>
                )}
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
                <div className={signupStyles.inputContainer}>
                  <div className={signupStyles.inputIcon}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${signupStyles.passwordInput}${errors.password ? "border-red-300" : "border-gray-200"}`}
                    placeholder="******"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={signupStyles.passwordToggle}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className={signupStyles.fieldError}>{errors.password}</p>
                )}
              </div>
              <div
                className={`${signupStyles.checkboxContainer}flex items-center gap-2`}
              >
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={signupStyles.checkbox}
                />
                <label
                  htmlFor="remember"
                  className={`${
                    theme === "dark" ? "text-white" : "text-gray-700"
                  } text-sm`}
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
            <div className={signupStyles.signInContainer}>
              <p
                className={`${
                  theme === "dark" ? "text-white" : "text-gray-700"
                } text-sm`}
              >
                Already have an account ?{" "}
                <Link to="/login" className={signupStyles.signInLink}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
