require('dotenv').config();
const express = require('express');
const cors = require('cors');
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

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production security
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
  }
});

// Use Socket.io Middleware and Handler
io.use(socketAuthMiddleware);
io.on('connection', socketHandler(io));

// Middlewares
app.use(cors());
app.use(express.json());

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

// Health check
app.get('/', (req, res) => {
  res.send('CID Cell API is running (with Socket.io active!)');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('✅ Socket.IO Initialized');
});

module.exports = { app, server, io }; // Export all for testing/index.js
