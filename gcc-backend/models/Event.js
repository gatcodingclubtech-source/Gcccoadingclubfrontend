const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    shortDesc: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: Date,
    },
    venue: {
      type: String,
      default: 'Online',
    },
    category: {
      type: String,
      enum: ['Workshop', 'Hackathon', 'Talk', 'Competition', 'Meetup', 'Other'],
      default: 'Workshop',
    },
    domain: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    registrationLink: {
      type: String,
      default: '',
    },
    tags: [String],
    maxParticipants: {
      type: Number,
      default: 0,
    },
    minTeamSize: {
      type: Number,
      default: 1,
    },
    maxTeamSize: {
      type: Number,
      default: 1,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
