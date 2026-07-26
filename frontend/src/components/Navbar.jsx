import React, { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
// import { Menu, X } from "lucide-react";
import { Menu, X, MoreVertical } from "lucide-react";

import { ThemeContext } from "./ThemeContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);

    window.location.href = "/login";
  };

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-lg shadow-lg transition-all duration-300 ${
        theme === "light"
          ? "bg-white/80 border-b border-gray-200"
          : "bg-gray-900/80 border-b border-gray-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:rotate-6 transition">
              <span className="text-white text-xl">📝</span>
            </div>

            <div>
              <h1
                className={`font-bold text-xl ${
                  theme === "light" ? "text-gray-800" : "text-white"
                }`}
              >
                Todo App
              </h1>

              <p className="text-xs text-gray-500">Manage your daily tasks</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Three Dot Menu */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  theme === "light"
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-yellow-400 text-black hover:bg-yellow-300"
                }`}
              >
                <MoreVertical size={22} strokeWidth={2.5} />
              </button>

              {menuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden ${
                    theme === "light"
                      ? "bg-white border border-gray-200"
                      : "bg-gray-900 border border-gray-700"
                  }`}
                >
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="block px-5 py-3 hover:bg-teal-500 hover:text-white"
                      >
                        Login
                      </Link>

                      {/* <Link
                        to="/signup"
                        onClick={() => setMenuOpen(false)}
                        className="block px-5 py-3 hover:bg-teal-500 hover:text-white"
                      >
                        Sign Up
                      </Link> */}
                    </>
                  ) : (
                    <>
                      <div
                        className={`px-5 py-3 border-b ${
                          theme === "dark"
                            ? "border-gray-700 text-white"
                            : "border-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs opacity-70">{user.email}</p>
                      </div>
                      {/* 
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block px-5 py-3 hover:bg-teal-500 hover:text-white"
                      >
                        Profile
                      </Link> */}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Theme Button */}
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                theme === "light"
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-yellow-400 text-black hover:bg-yellow-300"
              }`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setOpen(!open)}>
              {/* {mobileOpen ? <X size={26} /> : <Menu size={26} />} */}
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div
            className={`md:hidden flex flex-col py-4 gap-4 border-t transition-all ${
              theme === "light"
                ? "bg-white border-gray-200 text-gray-700"
                : "bg-gray-900 border-gray-700 text-white"
            }`}
          >
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="hover:text-teal-200"
            >
              Dashboard
            </Link>

            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="hover:text-teal-200"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="hover:text-teal-200"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
