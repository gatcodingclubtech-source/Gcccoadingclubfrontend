const mongoose = require('mongoose');

const quizSessionSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      default: 'general',
    },
    timerSeconds: {
      type: Number,
      default: 30,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    results: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        score: Number,
        totalQuestions: Number,
        timeTaken: Number, // in seconds
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuizSession', quizSessionSchema);
