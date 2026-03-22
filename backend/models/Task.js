const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a task title'],
    },
    description: {
        type: String,
        default: '',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['todo', 'in_progress', 'review', 'done'],
        default: 'todo',
    },
    difficulty: {
        type: String,
        enum: ['small', 'medium', 'large', 'critical'],
        default: 'small',
    },
    prLink: { type: String, default: '' },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    mentorFeedback: { type: String, default: '' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
