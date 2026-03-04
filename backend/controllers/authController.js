const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * @description: Function to generate JWT token (expiring in 7 days)
 * JWT Token generate karne ka helper function
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d' // Token expires in 7 days
    });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Naya user banayein)
 */
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists based on email
        // Email match karein aur check karein user hai ya nahi
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email / Is email se user pehle se hai'
            });
        }

        // Create new user (Role can be 'admin' or 'member', default is 'member')
        // Naya user banaiye database mein
        const user = await User.create({
            name,
            email,
            password, // Password hashing logic is in User model's pre('save') hook
            role: role || 'member'
        });

        if (user) {
            // Success response: Token + User Object (Password excluded)
            // Success hone par token aur user ki detail return karein
            res.status(201).json({
                success: true,
                token: generateToken(user._id),
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error during registration / Registration fail ho gaya' });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token (Login karke token lein)
 */
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email and select password for matching
        // Email se user dhundhein aur password bhi select karein (select: false default hai model mein)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password / Galat email ya password'
            });
        }

        // Check if password matches (Using pre-defined method in User model)
        // Password sahi hai ya nahi match karein (bcrypt internal call)
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password / Galat email ya password'
            });
        }

        // Success response: Token + User Object (Password excluded from response)
        // Login success - Token return karein
        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error during login / Login fail ho gaya' });
    }
};
