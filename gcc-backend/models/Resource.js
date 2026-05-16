const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Resource description is required']
  },
  type: {
    type: String,
    enum: ['Video', 'Document', 'Link', 'Code', 'Course'],
    default: 'Link'
  },
  url: {
    type: String,
    required: [true, 'Resource URL is required']
  },
  thumbnail: {
    type: String
  },
  domain: {
    type: String,
    default: 'General'
  },
  tags: [String],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
