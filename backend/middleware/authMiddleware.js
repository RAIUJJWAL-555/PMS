const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @description: Middleware to protect routes & verify JWT token
 * JWT token ko verify karne ke liye middleware
 */
const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with Bearer
    // Check karein ki headers mein Bearer token hai ya nahi
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token and attach to request object (exclude password)
            // Token se user decode karke request (req.user) mein store karein
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

/**
 * @description: Middleware to authorize based on user roles (admin/member)
 * Role check karne ke liye middleware (Admin hai ya Member)
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if user role is included in allowed roles
        // Agar user ka role allowed roles mein nahi hai to error dein
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
