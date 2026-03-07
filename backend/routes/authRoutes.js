const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMembers, getMemberStats } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/members
// @access  Private
router.get('/members', protect, getMembers);

// @route   GET /api/auth/member/:id/stats
// @access  Private
router.get('/member/:id/stats', protect, getMemberStats);

module.exports = router;
