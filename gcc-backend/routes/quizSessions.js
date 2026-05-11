const express = require('express');
const router = express.Router();
const QuizSession = require('../models/QuizSession');
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// @desc    Generate random ID and Password for a new test
// @route   GET /api/quiz-sessions/generate
// @access  Private/Admin
router.get('/generate', protect, adminOnly, (req, res) => {
  const testId = 'GCC-' + Math.floor(1000 + Math.random() * 9000);
  const password = Math.random().toString(36).substring(2, 8).toUpperCase();
  res.json({ success: true, testId, password });
});

// @desc    Create a new quiz session
// @route   POST /api/quiz-sessions
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { testId, password, title, domain, questions } = req.body;
    
    const session = await QuizSession.create({
      testId,
      password,
      title,
      domain,
      questions,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, session });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @desc    Get all quiz sessions
// @route   GET /api/quiz-sessions
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const sessions = await QuizSession.find()
      .populate('createdBy', 'name')
      .populate('questions')
      .sort('-createdAt');
    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Join a quiz session
// @route   POST /api/quiz-sessions/join
// @access  Public (Requires Auth)
router.post('/join', protect, async (req, res) => {
  try {
    const { testId, password } = req.body;
    const session = await QuizSession.findOne({ testId, password, isActive: true })
      .populate('questions', '-correctAnswer -explanation'); // Hide answers initially

    if (!session) {
      return res.status(404).json({ success: false, message: 'Invalid Test ID or Password' });
    }

    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Submit quiz results
// @route   POST /api/quiz-sessions/submit
// @access  Private
router.post('/submit', protect, async (req, res) => {
  try {
    const { sessionId, score, totalQuestions } = req.body;
    
    const session = await QuizSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Add result
    session.results.push({
      user: req.user._id,
      score,
      totalQuestions
    });

    await session.save();
    res.json({ success: true, message: 'Result submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
