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
const { socketHandler, setupProjectChatNamespace } = require('./socket/socketHandler');

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

// Build allowed origins list — hardcoded production + env var (comma-separated) + localhost fallback
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://cidcell.vercel.app', // production
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
    : []),
];

const corsOriginFn = (origin, callback) => {
  // Allow requests with no origin (e.g. server-to-server, curl, mobile apps)
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error(`CORS: Origin '${origin}' not allowed`));
};

const corsOptions = {
  origin: corsOriginFn,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: corsOriginFn,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  }
});

app.set('io', io); // Make io accessible in controllers via req.app.get('io')

// Use Socket.io Middleware and Handler — default namespace (DM + Doubt)
io.use(socketAuthMiddleware);
io.on('connection', socketHandler(io));

// Set up /project-chat namespace (group-only project chat)
setupProjectChatNamespace(io, socketAuthMiddleware);

// Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://raw.githubusercontent.com", "https://res.cloudinary.com", "https://lh3.googleusercontent.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "script-src-attr": ["'self'", "'unsafe-inline'"]
    },
  },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));
app.use(cors(corsOptions));
app.options('/*path', cors(corsOptions)); // Handle preflight for all routes (Express v5 wildcard syntax)
app.use(express.json());

// Global Fallback Rate Limiting (generous — per-route limits handle hot paths)
app.use(globalLimiter);

// Connect to database
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
app.use('/api/chat', require('./routes/chatHubRoutes'));

// Diagnostic route
app.get('/api/test-chat', (req, res) => {
    console.log('--- TEST CHAT ROUTE HIT ---');
    res.json({ 
        status: 'alive', 
        time: new Date().toISOString(),
        message: 'If you see this, the backend is updated.' 
    });
});

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
    console.log('\x1b[36m%s\x1b[0m', '--------------------------------------------------');
    console.log('\x1b[1m\x1b[32m%s\x1b[0m', '  🚀 CID-CELL BACKEND IS LIVE');
    console.log('\x1b[36m%s\x1b[0m', '--------------------------------------------------');
    console.log(`  📍  \x1b[33mPort:\x1b[0m      ${PORT}`);
    console.log(`  🌐  \x1b[33mClient:\x1b[0m    ${allowedOrigins.join(', ')}`);
    console.log(`  ⚡  \x1b[33mReal-time:\x1b[0m \x1b[32mSocket.IO Initialized\x1b[0m`);
    // The Database log will come from the async connectDB() function
  });
}

// ── Graceful Shutdown ─────────────────────────────────────────────────────────
// Ensures MongoDB connection and HTTP server close cleanly on deploy restart.
// Without this, Render/Railway may leave lingering connections on Atlas.
const gracefulShutdown = (signal) => {
  console.log(`\n[${signal}] Graceful shutdown initiated...`);
  server.close(async () => {
    try {
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed.');
    } catch (err) {
      console.error('Error closing MongoDB:', err.message);
    }
    console.log('✅ HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

module.exports = { app, server, io }; // Export all for testing/index.js
