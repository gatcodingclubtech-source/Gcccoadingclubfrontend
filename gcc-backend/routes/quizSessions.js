const express = require('express');
const router = express.Router();
const QuizSession = require('../models/QuizSession');
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { triggerAutomation } = require('../utils/automation');

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
    const { testId, password, title, domain, questions, timerSeconds } = req.body;
    
    const session = await QuizSession.create({
      testId,
      password,
      title,
      domain,
      questions,
      timerSeconds: timerSeconds || 30,
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
    const { sessionId, score, totalQuestions, timeTaken } = req.body;
    
    const session = await QuizSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Add result
    session.results.push({
      user: req.user._id,
      score,
      totalQuestions,
      timeTaken
    });

    await session.save();

    // Trigger Automation
    await triggerAutomation({
      userId: req.user._id,
      title: 'Quiz Completed!',
      message: `You scored ${score}/${totalQuestions} in ${session.title}. Great job!`,
      type: 'QUIZ'
    });

    res.json({ success: true, message: 'Result submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get results for a specific session
// @route   GET /api/quiz-sessions/:id/results
// @access  Private/Admin
router.get('/:id/results', protect, adminOnly, async (req, res) => {
  try {
    const session = await QuizSession.findById(req.params.id)
      .populate('results.user', 'name usn avatar department xp rank');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Sync session results to global leaderboard
// @route   POST /api/quiz-sessions/:id/sync
// @access  Private/Admin
router.post('/:id/sync', protect, adminOnly, async (req, res) => {
  try {
    const session = await QuizSession.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const User = require('../models/User');
    
    // For each result, add XP to the user
    for (const result of session.results) {
      const points = result.score * 10; // 10 XP per correct answer
      await User.findByIdAndUpdate(result.user, { $inc: { xp: points } });
    }

    res.json({ success: true, message: 'Leaderboard synced successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Update a quiz session
// @route   PUT /api/quiz-sessions/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, testId, password, domain, questions, timerSeconds } = req.body;
    const session = await QuizSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.title = title || session.title;
    session.testId = testId || session.testId;
    session.password = password || session.password;
    session.domain = domain || session.domain;
    session.timerSeconds = timerSeconds || session.timerSeconds;
    if (questions) session.questions = questions;

    await session.save();
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Delete a quiz session
// @route   DELETE /api/quiz-sessions/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const session = await QuizSession.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    await session.deleteOne();
    res.json({ success: true, message: 'Session removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
