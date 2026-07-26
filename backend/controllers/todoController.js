import Todo from "../models/todoModel.js";

export const addTodo = async (req, res) => {
  try {
    const todo = await Todo.create({
      title: req.body.title,
      dueDate: req.body.dueDate,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      todo,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      todos,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
      },
    );

    res.json({
      success: true,
      todo,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.json({
      success: true,
      message: "Todo deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const clearCompleted = async (req, res) => {
  try {
    await Todo.deleteMany({
      userId: req.user.id,
      completed: true,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
