const mongoose = require('mongoose');

const contributorSchema = new mongoose.Schema({
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role:       { type: String, enum: ['developer', 'tester', 'designer', 'viewer'], default: 'developer' },
    level:      { type: String, enum: ['new_contributor', 'active_contributor', 'core_member'], default: 'new_contributor' },
    score:      { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    status:     { type: String, enum: ['active', 'inactive'], default: 'active' },
    joinedAt:   { type: Date, default: Date.now },
}, { _id: false });

const mentorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { _id: false });

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a project title'],
        trim: true,
        maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    type: {
        type: String,
        enum: ['independent', 'collaborative'],
        required: [true, 'Please specify project type'],
    },
    techStack: [{ type: String, maxlength: 50 }],

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

    githubRepo:    { type: String, default: '', maxlength: [500, 'GitHub URL too long'] },
    deployedLink:  { type: String, default: '', maxlength: [500, 'Deployed URL too long'] },
    images:        [{ type: String }],

    contributors: [contributorSchema],
    mentors:      [mentorSchema],

    facultyReviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    adminApprover:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Feedback trail
    mentorFeedback:  { type: String, default: '', maxlength: 2000 },
    facultyFeedback: { type: String, default: '', maxlength: 2000 },
    adminFeedback:   { type: String, default: '', maxlength: 2000 },

    // Auto-inactivity tracking
    lastActivityAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

// ── Query Indexes ─────────────────────────────────────────────────────────────
// Used on almost every public API call: GET /api/projects
projectSchema.index({ status: 1, createdAt: -1 });
// Used by /mine/all and review queues
projectSchema.index({ createdBy: 1 });
// Used by admin review queues
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);
