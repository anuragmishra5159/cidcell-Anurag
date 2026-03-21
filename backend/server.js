require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { globalLimiter } = require('./middleware/rateLimiters');
const http = require('http'); // Import HTTP for Socket.io
const { Server } = require('socket.io'); // Import Socket.io
const connectDB = require('./config/db');

// Socket Logic
const socketAuthMiddleware = require('./middleware/socketAuthMiddleware');
const socketHandler = require('./socket/socketHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const eventRoutes = require('./routes/eventRoutes');
const memberRoutes = require('./routes/memberRoutes');
const messageRoutes = require('./routes/messageRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
  }
});

// Use Socket.io Middleware and Handler
io.use(socketAuthMiddleware);
io.on('connection', socketHandler(io));

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Global Fallback Rate Limiting (generous — per-route limits handle hot paths)
app.use(globalLimiter);

// Connect to database
console.log('Using MONGO_URI:', process.env.MONGO_URI);
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('CID Cell API is running (with Socket.io active!)');
});

// Error handling middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('✅ Socket.IO Initialized');
  });
}

module.exports = { app, server, io }; // Export all for testing/index.js
