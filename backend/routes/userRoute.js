import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  upadteProfile,
  updatePassword,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.put("/profile", authMiddleware, upadteProfile);
userRouter.put("/password", authMiddleware, updatePassword);

export default userRouter;
