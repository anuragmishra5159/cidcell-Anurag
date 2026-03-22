const mongoose = require('mongoose');

const projectMessageSchema = new mongoose.Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
    chatType: {
        type: String,
        enum: ['group', 'private'],
        default: 'group'
    },
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

// Index for efficient querying of project messages
projectMessageSchema.index({ projectId: 1, chatType: 1, createdAt: 1 });

module.exports = mongoose.model('ProjectMessage', projectMessageSchema);
