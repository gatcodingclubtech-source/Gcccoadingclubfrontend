const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      default: 'GAT Coding Club',
    },
    razorpayKeyId: {
      type: String,
      default: '',
    },
    razorpayKeySecret: {
      type: String,
      default: '',
    },
    upiId: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    smtpEmail: {
      type: String,
      default: '',
    },
    smtpPassword: {
      type: String,
      default: '',
    },
    smtpHost: {
      type: String,
      default: 'smtp.gmail.com',
    },
    smtpPort: {
      type: Number,
      default: 587,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
