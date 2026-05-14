const mongoose = require('mongoose');

const domainRegistrationSchema = new mongoose.Schema(
  {
    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Domain',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    // Captured data at the time of registration
    name: String,
    email: String,
    usn: String,
    department: String,
    year: String,
    phone: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    decidedAt: Date,
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending applications
domainRegistrationSchema.index({ domain: 1, user: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

module.exports = mongoose.model('DomainRegistration', domainRegistrationSchema);
