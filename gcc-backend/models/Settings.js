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
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
