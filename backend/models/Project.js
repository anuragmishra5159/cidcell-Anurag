const mongoose = require('mongoose');

const contributorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now },
}, { _id: false });

const mentorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { _id: false });

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a project title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    type: {
        type: String,
        enum: ['independent', 'collaborative'],
        required: [true, 'Please specify project type'],
    },
    techStack: [{ type: String }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    status: {
        type: String,
        enum: [
            'draft',
            'pending_mentor_review',
            'pending_faculty_review',
            'pending_admin_approval',
            'active',
            'rejected',
            'completed',
            'inactive',
        ],
        default: 'draft',
    },

    githubRepo: { type: String, default: '' },
    deployedLink: { type: String, default: '' },
    images: [{ type: String }],

    contributors: [contributorSchema],
    mentors: [mentorSchema],

    facultyReviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    adminApprover: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Feedback trail
    mentorFeedback: { type: String, default: '' },
    facultyFeedback: { type: String, default: '' },
    adminFeedback: { type: String, default: '' },

    // Auto-inactivity tracking
    lastActivityAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
