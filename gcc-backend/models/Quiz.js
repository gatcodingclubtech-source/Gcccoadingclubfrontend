const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length === 4;
        },
        message: 'Exactly 4 options are required',
      },
      required: true,
    },
    correctAnswer: {
      type: Number, // index of correct option (0-3)
      required: [true, 'Correct answer index is required'],
      min: 0,
      max: 3,
    },
    explanation: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      enum: [
        'web-development',
        'ai-ml',
        'competitive-coding',
        'app-development',
        'cyber-security',
        'cloud-computing',
        'general',
      ],
      default: 'general',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    points: {
      type: Number,
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quizSchema);
