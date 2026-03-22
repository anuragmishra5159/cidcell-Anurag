const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    message: {
        type: String,
        required: [true, 'Please explain why you want to join this project'],
        minlength: [30, 'Message must be at least 30 characters'],
    },
    skills: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'removed'],
        default: 'pending',
    },
    reviewedAt: {
        type: Date,
        default: null,
    },
    reapplyAfter: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// Prevent duplicate pending requests for the same user + project
joinRequestSchema.index({ userId: 1, projectId: 1 });

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
