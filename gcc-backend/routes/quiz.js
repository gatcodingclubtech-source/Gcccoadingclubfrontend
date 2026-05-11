const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// @desc    Get questions by domain
// @route   GET /api/quiz/:domain
// @access  Public
router.get('/:domain', async (req, res) => {
  try {
    const questions = await Quiz.find({ 
      domain: req.params.domain,
      isActive: true 
    }).sort('-createdAt');
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all questions (Admin only)
// @route   GET /api/quiz
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const questions = await Quiz.find({}).sort('-createdAt');
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add quiz question
// @route   POST /api/quiz
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const question = new Quiz({
      ...req.body,
      createdBy: req.user._id,
    });
    const savedQuestion = await question.save();
    res.status(201).json({ success: true, question: savedQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update question
// @route   PUT /api/quiz/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const question = await Quiz.findById(req.params.id);
    if (question) {
      Object.assign(question, req.body);
      const updatedQuestion = await question.save();
      res.json({ success: true, question: updatedQuestion });
    } else {
      res.status(404).json({ success: false, message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete question
// @route   DELETE /api/quiz/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const question = await Quiz.findById(req.params.id);
    if (question) {
      await question.deleteOne();
      res.json({ success: true, message: 'Question removed' });
    } else {
      res.status(404).json({ success: false, message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
