const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please add a username'],
            trim: true,
            maxlength: [100, 'Username cannot exceed 100 characters'],
        },
        enrollmentNo: {
            type: String,
            unique: true,
            sparse: true, // Allows null/undefined values to be unique
            trim: true,
            uppercase: true,
            maxlength: [20, 'Enrollment number cannot exceed 20 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        branch: {
            type: String,
            maxlength: [100, 'Branch cannot exceed 100 characters'],
        },
        batch: {
            type: String,
            maxlength: [20, 'Batch cannot exceed 20 characters'],
        },
        skills: {
            type: [String],
            default: [],
        },
        socialLinks: {
            linkedin: { type: String, default: '' },
            github:   { type: String, default: '' },
            leetcode: { type: String, default: '' },
            other:    { type: String, default: '' },
        },
        // For Google authentication
        googleId: {
            type: String,
            sparse: true,
            unique: true,
        },
        profilePicture: {
            type: String,
            default: '',
        },
        // NORMALISED to lowercase only — no more 'Admin' vs 'admin' mismatch
        userType: {
            type: String,
            enum: ['student', 'faculty', 'hod', 'admin', 'member', 'mentor'],
            default: 'student',
        },
        domainOfExpertise: {
            type: String,
            default: '',
            maxlength: [200, 'Domain of expertise cannot exceed 200 characters'],
        },
        department: {
            type: String,
            default: '',
            maxlength: [100, 'Department cannot exceed 100 characters'],
        },
        aboutMentor: {
            type: String,
            default: '',
            maxlength: [1000, 'About section cannot exceed 1000 characters'],
        },
        expertise: {
            type: [String],
            default: [],
        }
    },
    {
        timestamps: true,
    }
);

// ── Pre-save normalisation ────────────────────────────────────────────────────
// Ensures userType is always stored in lowercase regardless of what is passed in.
// This eliminates the 'Admin' vs 'admin' privilege-escalation inconsistency.
userSchema.pre('save', function (next) {
    if (this.isModified('userType') && this.userType) {
        this.userType = this.userType.toLowerCase();
    }
    next();
});

// ── Query Indexes ─────────────────────────────────────────────────────────────
userSchema.index({ userType: 1 });           // Used by /users/mentors, /users/faculty
userSchema.index({ email: 1 }, { unique: true }); // enforce at index level too

module.exports = mongoose.model('User', userSchema);
