import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import todoRouter from "./routes/todoRoute.js";
// import incomeRouter from "./routes/incomeRoute.js";
// import expenseRouter from "./routes/expenseRoute.js";
// import dashboardRouter from "./routes/dashboardRoute.js";

const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// DB
connectDb();
// ROUTE
app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);

app.get("/", (req, res) => {
  res.send("API is working ");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
