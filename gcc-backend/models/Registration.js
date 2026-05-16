const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // The person who filled the form (Leader by default)
    },
    teamName: {
      type: String,
      trim: true,
    },
    teamLeader: {
      name: String,
      email: String,
      usn: String,
      phone: String,
    },
    members: [
      {
        name: String,
        email: String,
        usn: String,
        phone: String,
        isRegisteredUser: {
          type: Boolean,
          default: false
        }
      }
    ],
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'N/A'],
      default: 'N/A',
    },
    transactionId: {
      type: String,
      trim: true,
    },
    paymentScreenshot: {
      type: String,
    },
    additionalInfo: String,
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate registrations for the same event by the same user
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
