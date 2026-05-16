const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Discussion title is required'],
    trim: true,
    maxlength: 150
  },
  content: {
    type: String,
    required: [true, 'Discussion content is required']
  },
  category: {
    type: String,
    enum: ['General', 'Technical', 'AI / ML', 'Web Dev', 'Cyber Security', 'Career', 'Projects', 'Events'],
    default: 'General'
  },
  tags: [String],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  aiSummary: { type: String }, // Automatically generated summary
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Middleware to calculate score
discussionSchema.virtual('score').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

discussionSchema.set('toJSON', { virtuals: true });
discussionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Discussion', discussionSchema);
