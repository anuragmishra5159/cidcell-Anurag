const mongoose = require('mongoose');

const doubtSessionSchema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    domain: { type: String, required: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    lastMessage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('DoubtSession', doubtSessionSchema);
