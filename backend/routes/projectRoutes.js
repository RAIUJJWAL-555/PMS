const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} = require('../controllers/projectController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// @route   POST /api/projects
// @access  Private/Admin
router.post('/', protect, isAdmin, createProject);

// @route   GET /api/projects
// @access  Private
router.get('/', protect, getProjects);

// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', protect, getProjectById);

// @route   DELETE /api/projects/:id
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, deleteProject);

module.exports = router;
