const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getMyTasks,
  getAllTasks,
  assignTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// @route   POST /api/tasks (Create Task - Admin Only)
router.post('/', protect, isAdmin, createTask);

// @route   GET /api/tasks (Get all tasks - Admin Only)
router.get('/', protect, isAdmin, getAllTasks);

// @route   GET /api/tasks/project/:projectId (Get all tasks of a project - Protected)
router.get('/project/:projectId', protect, getTasksByProject);

// @route   GET /api/tasks/my-tasks (Get logged in user's tasks - Member, Protected)
router.get('/my-tasks', protect, getMyTasks);

// @route   PUT /api/tasks/:id/assign (Assign Task to user - Admin Only)
router.put('/:id/assign', protect, isAdmin, assignTask);

// @route   PUT /api/tasks/:id/status (Update Task Status - Member/Admin)
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
