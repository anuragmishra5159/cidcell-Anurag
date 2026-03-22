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
const uploadRoutes = require('./routes/uploadRoutes');
const joinRequestRoutes = require('./routes/joinRequestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

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

app.set('io', io); // Make io accessible in controllers via req.app.get('io')

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
app.use('/api/upload', uploadRoutes);
app.use('/api/join-requests', joinRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/project-messages', require('./routes/projectMessageRoutes'));

// Auto-inactivity cleanup (runs every 12 hours)
setInterval(async () => {
    try {
        const Project = require('./models/Project');
        const Notification = require('./models/Notification');
        const JoinRequest = require('./models/JoinRequest');
        
        const now = new Date();
        const TEN_DAYS  = 10 * 24 * 60 * 60 * 1000;
        const TWENTY_DAYS = 20 * 24 * 60 * 60 * 1000;
        
        const projects = await Project.find({ type: 'collaborative', status: 'active' });
        
        for (let project of projects) {
            let modified = false;
            
            // Loop backwards or safely filter for removals
            // Actually, we can just filter it at the end if any are removed
            let contributorsToRemove = [];

            for (let contributor of project.contributors) {
                const lastActiveDate = contributor.lastActive || contributor.joinedAt;
                
                // Stage 1 — warn at 10 days
                if (
                    contributor.status === 'active' &&
                    (now - lastActiveDate) > TEN_DAYS
                ) {
                    contributor.status = 'inactive';
                    modified = true;
                    
                    await Notification.create({
                        userId: contributor.userId,
                        type: 'contributor_removed', // reusing system as requested
                        message: `You have been marked inactive on "${project.title}". Complete a task within 10 days to avoid removal.`,
                        link: `/projects/${project._id}`,
                        isRead: false
                    });
                }

                // Stage 2 — remove at 20 days
                if (
                    contributor.status === 'inactive' &&
                    (now - lastActiveDate) > TWENTY_DAYS
                ) {
                    contributorsToRemove.push(contributor.userId.toString());
                    modified = true;

                    await JoinRequest.findOneAndUpdate(
                        { 
                            userId: contributor.userId, 
                            projectId: project._id 
                        },
                        { status: 'removed' }
                    );

                    await Notification.create({
                        userId: contributor.userId,
                        type: 'contributor_removed',
                        message: `You have been removed from "${project.title}" due to 20 days of inactivity.`,
                        link: `/projects/${project._id}`,
                        isRead: false
                    });
                }
            }

            // Apply removals
            if (contributorsToRemove.length > 0) {
                project.contributors = project.contributors.filter(
                    c => !contributorsToRemove.includes(c.userId.toString())
                );
            }

            if (modified) await project.save();
        }
    } catch (err) {
        console.error('Inactivity cleanup error:', err);
    }
}, 12 * 60 * 60 * 1000);

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
