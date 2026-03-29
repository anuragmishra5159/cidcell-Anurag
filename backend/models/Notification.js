const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['join_request', 'system', 'join_accepted', 'join_rejected', 'task_assigned', 'message_received', 'contributor_removed'], 
        default: 'system' 
    },
    message: { 
        type: String, 
        required: true,
        maxlength: [500, 'Notification message cannot exceed 500 characters'],
    },
    link: { 
        type: String 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

// ── Indexes ───────────────────────────────────────────────────────────────────
// Efficient querying by user and sorting by date
notificationSchema.index({ userId: 1, createdAt: -1 });
// isRead index for fast "unread count" queries
notificationSchema.index({ userId: 1, isRead: 1 });

// ── TTL: Auto-delete notifications older than 30 days ─────────────────────────
// This prevents unbounded accumulation on the Atlas free tier (512MB limit).
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Notification', notificationSchema);
