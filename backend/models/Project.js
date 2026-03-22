const mongoose = require('mongoose');

const contributorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['developer', 'tester', 'designer', 'viewer'], default: 'developer' },
    level: { type: String, enum: ['new_contributor', 'active_contributor', 'core_member'], default: 'new_contributor' },
    score: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
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
