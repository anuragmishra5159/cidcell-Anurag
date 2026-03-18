const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // A user can only be one member entry
  },
  team: {
    type: String,
    required: true,
    enum: ['Student Board', 'Core Team', 'Sub-Teams']
  },
  designation: {
    type: String,
    required: true
  },
  domain: {
    type: String, // e.g., "Full Stack", "AI/ML", "UI/UX" - especially for Sub-Teams
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);
