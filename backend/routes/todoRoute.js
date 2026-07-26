import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  clearCompleted,
} from "../controllers/todoController.js";

const todoRouter = express.Router();

todoRouter.post("/", authMiddleware, addTodo);

todoRouter.get("/", authMiddleware, getTodos);

todoRouter.put("/:id", authMiddleware, updateTodo);

todoRouter.delete("/:id", authMiddleware, deleteTodo);

todoRouter.delete("/completed/all", authMiddleware, clearCompleted);

export default todoRouter;
