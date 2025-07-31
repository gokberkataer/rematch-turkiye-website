const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Please log in to continue' });
        }
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Please log in to continue' });
        }
        const user = await User.findById(req.session.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    isAuthenticated,
    isAdmin
}; 