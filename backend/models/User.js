const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please add a username'],
        },
        enrollmentNo: {
            type: String,
            unique: true,
            sparse: true, // Allows null/undefined values to be unique
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        branch: {
            type: String,
        },
        batch: {
            type: String,
        },
        skills: {
            type: [String],
            default: [],
        },
        socialLinks: {
            linkedin: { type: String, default: '' },
            github: { type: String, default: '' },
            leetcode: { type: String, default: '' },
            other: { type: String, default: '' },
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
        userType: {
            type: String,
            enum: ['student', 'faculty', 'HOD', 'Admin', 'member', 'mentor'],
            default: 'student',
        },
        domainOfExpertise: {
            type: String,
            default: '',
        },
        department: {
            type: String,
            default: '',
        },
        aboutMentor: {
            type: String,
            default: '',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
