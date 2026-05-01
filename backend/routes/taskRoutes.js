const express = require("express");
const router = express.Router();

const { 
  createTask, 
  getTasks, 
  updateTask,   // ✅ updated
  getTaskById,
  deleteTask
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;