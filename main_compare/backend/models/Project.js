const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a project name'],
        trim: true
    },
    theme: {
        type: String,
        required: [true, 'Please select a theme'],
        enum: ['ML', 'web', 'ai', 'Cyber Security', 'hardware', 'iot'],
        default: 'web'
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    techStack: {
        type: [String],
        default: []
    },
    github: {
        type: String,
        trim: true
    },
    liveLink: {
        type: String,
        trim: true
    },
    mentor: {
        type: String,
        trim: true
    },
    members: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Under Development', 'Completed', 'Archived', 'Proposed'],
        default: 'Under Development'
    },
    year: {
        type: String
    },
    imageUrl: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
