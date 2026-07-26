import React, { useState, useEffect } from "react";
import "./TodoApp.css";
import {
  Trash2,
  Trash,
  Plus,
  Save,
  MoreVertical,
  Pencil,
  Trash2 as DeleteIcon,
} from "lucide-react";
const TodoApp = ({ user }) => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [theme, setTheme] = useState("light");
  const [openMenu, setOpenMenu] = useState(null);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("todos"));
    const storedTheme = localStorage.getItem("theme");
    if (stored) setTodos(stored);
    if (storedTheme) setTheme(storedTheme);
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // useEffect(() => {
  //   document.body.classList.remove("light-theme", "dark-theme");
  //   document.body.classList.add(`${theme}-theme`);
  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  const addOrUpdate = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    if (editingId !== null) {
      setTodos(
        todos.map((t) =>
          t.id === editingId ? { ...t, title: trimmed, dueDate } : t,
        ),
      );
      setEditingId(null);
    } else {
      setTodos([
        {
          id: Date.now(),
          title: trimmed,
          dueDate,
          completed: false,
          createdAt: new Date().toISOString(),
        },
        ...todos,
      ]);
    }

    setTitle("");
    setDueDate("");
  };

  const editTodo = (t) => {
    setEditingId(t.id);
    setTitle(t.title);
    setDueDate(t.dueDate || "");
  };

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));
  const clearAll = () => setTodos([]);
  const clearCompleted = () => setTodos(todos.filter((t) => !t.completed));
  const toggleComplete = (id) =>
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  const formatDate = (d) => new Date(d).toLocaleString();

  const filtered = todos
    .filter((t) => filter === "all" || (filter === "completed") === t.completed)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "created")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "due")
      return new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity);
    if (sortBy === "completed")
      return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
    return 0;
  });

  const now = new Date();

  return (
    <div className="todo-container">
      <div className="top-bar">
        {/* <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        >
          {theme === "light" ? "🌙 Dark" : "🔆 Light"}
        </button> */}
      </div>
      <div className="todo-form">
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button
          className="icon-btn add-btn"
          onClick={addOrUpdate}
          title={editingId ? "Update Task" : "Add Task"}
        >
          {editingId ? <Save size={18} /> : <Plus size={18} />}
        </button>

        <button
          className="icon-btn complete-btn"
          onClick={clearCompleted}
          title="Clear Completed"
        >
          <Trash2 size={18} />
        </button>

        <button
          className="icon-btn delete-btn"
          onClick={clearAll}
          title="Clear All"
        >
          <Trash size={18} />
        </button>
      </div>

      <div className="todo-controls">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="control-group">
          <label>Filter</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="created">Created</option>
            <option value="due">Due Date</option>
            <option value="completed">Completed First</option>
          </select>
        </div>
      </div>

      <ul className="todo-list">
        {sorted.length === 0 && <p className="no-tasks">No tasks found.</p>}
        {sorted.map((t) => {
          const overdue =
            t.dueDate && new Date(t.dueDate) < now && !t.completed;
          return (
            <li
              key={t.id}
              className={`todo-item ${t.completed ? "completed" : ""} ${
                overdue ? "overdue" : ""
              }`}
            >
              <div className="item-header">
                <div className="left-section">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(t.id)}
                  />

                  <span className="todo-item-title">{t.title}</span>
                </div>

                <div className="menu-wrapper">
                  <button
                    className="menu-btn"
                    onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openMenu === t.id && (
                    <div className="task-menu">
                      <button
                        onClick={() => {
                          editTodo(t);
                          setOpenMenu(null);
                        }}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          deleteTodo(t.id);
                          setOpenMenu(null);
                        }}
                      >
                        <DeleteIcon size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="todo-item-meta">
                <span>🕓 {formatDate(t.createdAt)}</span>
                {t.dueDate && <span>📅 {formatDate(t.dueDate)}</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TodoApp;
