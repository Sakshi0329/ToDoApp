import React, { useEffect, useState } from "react";
import { Trash2, Trash, Plus, Save, MoreVertical, Pencil } from "lucide-react";

import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const TodoApp = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchTodos();
  }, []);
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/todo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos(res.data.todos);
    } catch (err) {
      console.log(err);
    }
  };
  // useEffect(() => {
  //   const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];

  //   setTodos(storedTodos);
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("todos", JSON.stringify(todos));
  // }, [todos]);
  const addOrUpdate = async () => {
    if (!title.trim()) return;

    try {
      if (editingId) {
        // Update Todo
        await axios.put(
          `${BASE_URL}/todo/${editingId}`,
          {
            title,
            dueDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        // Add Todo
        await axios.post(
          `${BASE_URL}/todo`,
          {
            title,
            dueDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      setTitle("");
      setDueDate("");
      setEditingId(null);

      fetchTodos();
    } catch (err) {
      console.log(err);
    }
  };

  const editTodo = (todo) => {
    setEditingId(todo._id);
    setTitle(todo.title);
    setDueDate(todo.dueDate || "");
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/todo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTodos();
    } catch (err) {
      console.log(err);
    }
  };

  const clearCompleted = async () => {
    try {
      await axios.delete(`${BASE_URL}/todo/completed/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTodos();
    } catch (err) {
      console.log(err);
    }
  };
  const clearAll = async () => {
    try {
      await axios.delete(`${BASE_URL}/todo/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTodos();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      await axios.put(
        `${BASE_URL}/todo/${todo._id}`,
        {
          completed: !todo.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchTodos();
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "completed") return todo.completed;
      if (filter === "active") return !todo.completed;
      return true;
    })
    .filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()));

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "created") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortBy === "due") {
      return (
        new Date(a.dueDate || "2999-12-31") -
        new Date(b.dueDate || "2999-12-31")
      );
    }

    if (sortBy === "completed") {
      return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
    }

    return 0;
  });

  const now = new Date();

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {/* Header */}
        {/* <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Todo App</h1>
            <p className="text-sm text-gray-500">Organize your daily tasks</p>
          </div>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div> */}

        {/* Add Todo Card */}
        <div
          className={`rounded-xl shadow-lg p-5 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col gap-4">
            {/* Task */}
            <input
              type="text"
              placeholder="Enter task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 outline-none transition
              ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                  : "bg-white border-gray-300 focus:border-blue-500"
              }`}
            />

            {/* Date + Buttons */}
            <div className="flex items-center gap-2">
              {/* Date */}
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`flex-1 md:flex-none md:w-44 min-w-0 rounded-lg border px-2 py-2 text-sm outline-none
      ${
        theme === "dark"
          ? "bg-gray-700 border-gray-600 text-white"
          : "bg-white border-gray-300"
      }`}
              />

              {/* Add */}
              <button
                onClick={addOrUpdate}
                className="h-10 w-10 flex-shrink-0 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
              >
                {editingId ? <Save size={18} /> : <Plus size={18} />}
              </button>

              {/* Clear Completed */}
              <button
                onClick={clearCompleted}
                className="h-10 w-10 flex-shrink-0 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center"
              >
                <Trash2 size={18} />
              </button>

              {/* Clear All */}
              <button
                onClick={clearAll}
                className="h-10 w-10 flex-shrink-0 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
          {/* </div> */}

          {/* Search + Filter + Sort */}
          <div
            className={`mt-6 rounded-xl shadow-lg p-5 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="grid grid-cols-12 gap-4 items-end">
              {/* Search */}
              <div className="col-span-12 md:col-span-6">
                <input
                  type="text"
                  placeholder="🔍 Search task..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Filter */}
              <div className="col-span-6 md:col-span-3">
                <label className="block mb-1 text-sm font-semibold">
                  Filter
                </label>

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-3 outline-none ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Sort */}
              <div className="col-span-6 md:col-span-3">
                <label className="block mb-1 text-sm font-semibold">
                  Sort By
                </label>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-3 outline-none ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="created">Created</option>
                  <option value="due">Due Date</option>
                  <option value="completed">Completed First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="mt-6 space-y-4">
          {sortedTodos.length === 0 ? (
            <div
              className={`rounded-xl p-10 text-center shadow ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-400"
                  : "bg-white text-gray-500"
              }`}
            >
              <h2 className="text-xl font-semibold">No Tasks Found</h2>
              <p className="mt-2">Add a new task to get started 🚀</p>
            </div>
          ) : (
            sortedTodos.map((todo) => {
              const overdue =
                todo.dueDate && new Date(todo.dueDate) < now && !todo.completed;

              return (
                <div
                  key={todo._id}
                  className={`rounded-xl shadow-lg p-5 transition-all duration-300
        ${theme === "dark" ? "bg-gray-800" : "bg-white"}
        ${
          overdue ? "border-l-4 border-red-500" : "border-l-4 border-green-500"
        }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    {/* Left */}
                    <div className="flex gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo)}
                        className="mt-1 h-5 w-5 accent-green-500 cursor-pointer"
                      />

                      <div className="flex-1">
                        <h3
                          className={`text-lg font-semibold break-words
                ${todo.completed ? "line-through opacity-50" : ""}`}
                        >
                          {todo.title}
                        </h3>

                        <div className="mt-2 flex flex-col gap-1 text-sm opacity-80">
                          <span>🕓 Created : {formatDate(todo.createdAt)}</span>

                          {todo.dueDate && (
                            <span>📅 Due : {formatDate(todo.dueDate)}</span>
                          )}

                          {overdue && (
                            <span className="font-semibold text-red-500">
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Three Dot Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === todo._id ? null : todo._id)
                        }
                        className={`rounded-lg p-2 transition
                ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
                      >
                        <MoreVertical size={20} />
                      </button>

                      {openMenu === todo._id && (
                        <div
                          className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl overflow-hidden z-50
                ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}
                        >
                          <button
                            onClick={() => {
                              editTodo(todo);
                              setOpenMenu(null);
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-left transition
                  ${
                    theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
                          >
                            <Pencil size={17} />
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              deleteTodo(todo._id);
                              setOpenMenu(null);
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-left text-red-500 transition
                  ${
                    theme === "dark" ? "hover:bg-gray-600" : "hover:bg-red-50"
                  }`}
                          >
                            <Trash2 size={17} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
