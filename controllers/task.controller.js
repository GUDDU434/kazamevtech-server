const express = require("express");
const Task = require("../models/task.model.js");
const authMiddleware = require("../middleware/auth_middleware");

const taskRouter = express.Router();

// Create Task
module.exports.CreateTask = async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, user: req?.user?.userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Tasks
module.exports.GetAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Single Task
module.exports.GetTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Task
module.exports.UpdateTask = async (req, res) => {
  try {
    let task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Task
module.exports.DeleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.userId) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
