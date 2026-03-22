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
        required: true 
    },
    link: { 
        type: String 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

// Index for efficient querying by user and sorting by date
notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
