const jwt = require('jsonwebtoken');

const socketAuthMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // Contains { id: ... }
        next();
    } catch (error) {
        return next(new Error('Authentication error: Invalid token'));
    }
};

module.exports = socketAuthMiddleware;
