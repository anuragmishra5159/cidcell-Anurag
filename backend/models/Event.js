const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
    },
    location: {
      type: String,
      required: true,
      maxlength: 100,
    },
    organizer: {
      type: String,
      required: true,
      maxlength: 100,
    },
    organizerEmail: {
      type: String,
      required: true,
    },
    creatorName: {
      type: String,
    },
    userType: {
      type: String,
      enum: ["alumni", "student", "member", "faculty", "HOD", "admin"],
      default: "alumni",
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: [
        "trainig and mentorships",
        "tech",
        "cultural",
        "sports",
        "educational",
        "special",
      ],
      default: "special",
    },
    type: {
      type: String,
      enum: ["virtual", "in-person"],
      default: "in-person",
    },
    maxAttendees: {
      type: Number,
      default: 30,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    whatsappGroupLink: {
      type: String,
      required: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['proposal', 'approved', 'rejected'],
      default: 'approved', // keeps all existing admin-created events visible
    },
    proposedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

eventSchema.virtual("registrations", {
  ref: "EventRegistration",
  localField: "_id",
  foreignField: "eventId",
});

eventSchema.set("toObject", { virtuals: true });
eventSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
