const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Make sure the path is correct
require('dotenv').config();

exports.protect = async (req, res, next) => {
    const token = req.cookies.token; // JWT is stored in cookies

    if (!token) {
        return res.redirect('/login');  // Redirect if no token is present
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
        req.user = await User.findById(decoded.id);  // Attach user to request
        next();  // Move to the next middleware
    } catch (err) {
        return res.status(401).render('login', { errorMessage: 'Session expired. Please log in again.' });
    }
};
