const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * PROTECT — Verifies JWT and attaches req.user.
 *
 * Performance improvement: We store {id, userType, email} directly in the JWT
 * payload so most middleware checks (e.g., isAdmin, isFaculty) can be done
 * WITHOUT a database round-trip. A DB lookup is only performed if the token
 * payload does not contain a userType (legacy tokens) or when fresh data is
 * explicitly needed (e.g., profile endpoint).
 */
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If token carries full payload (new format), avoid DB hit
        if (decoded.userType) {
            req.user = {
                _id:      decoded.id,
                id:       decoded.id,
                userType: decoded.userType,
                email:    decoded.email,
            };
            return next();
        }

        // Legacy tokens: fall back to DB lookup
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

const admin = (req, res, next) => {
    const role = req.user?.userType?.toLowerCase();
    if (role === 'admin' || role === 'hod') {
        return next();
    }
    res.status(403).json({ message: 'Not authorized as an admin or HOD' });
};

const optionalProtect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) return next();

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userType) {
            req.user = { _id: decoded.id, id: decoded.id, userType: decoded.userType, email: decoded.email };
        } else {
            req.user = await User.findById(decoded.id).select('-password');
        }
    } catch (_) {
        // Invalid token — proceed without user (public access)
    }
    next();
};

const isFaculty = (req, res, next) => {
    if (req.user?.userType?.toLowerCase() === 'faculty') return next();
    res.status(403).json({ message: 'Faculty access only' });
};

const isMentor = (req, res, next) => {
    if (req.user?.userType?.toLowerCase() === 'mentor') return next();
    res.status(403).json({ message: 'Mentor access required' });
};

const isStudent = (req, res, next) => {
    if (req.user?.userType?.toLowerCase() === 'student') return next();
    res.status(403).json({ message: 'Student access required' });
};

module.exports = { protect, admin, isFaculty, isMentor, isStudent, optionalProtect };
