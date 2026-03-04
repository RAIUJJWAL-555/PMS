const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Route for registering a new user (Naya user baniye)
 */
// Yeh route user ko register karne ke liye hai
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Route for authenticating a user (Login kariye)
 */
// Yeh route user ko login karke token dene ke liye hai
router.post('/login', loginUser);

module.exports = router;
