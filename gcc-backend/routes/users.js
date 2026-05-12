const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const Event = require('../models/Event');
const QuizSession = require('../models/QuizSession');

// @desc    Get user stats for profile
// @route   GET /api/users/profile/stats
// @access  Private
router.get('/profile/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Count events where user is in attendees list
    const eventCount = await Event.countDocuments({ attendees: userId });

    // Count quiz sessions where user is in results list
    const quizSessions = await QuizSession.find({ 'results.user': userId });
    const quizCount = quizSessions.length;

    // Calculate total points (sum of scores from all results for this user)
    let totalPoints = 0;
    quizSessions.forEach(session => {
      const result = session.results.find(r => r.user.toString() === userId.toString());
      if (result) {
        totalPoints += (result.score || 0);
      }
    });

    res.json({
      success: true,
      stats: {
        eventCount,
        quizCount,
        totalPoints,
        rank: '#1' // Placeholder for rank until leaderboard logic is full
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.usn = req.body.usn || user.usn;
      user.department = req.body.department || user.department;
      user.year = req.body.year || user.year;
      user.bio = req.body.bio || user.bio;
      user.skills = req.body.skills || user.skills;
      user.githubUrl = req.body.githubUrl || user.githubUrl;
      user.linkedinUrl = req.body.linkedinUrl || user.linkedinUrl;
      user.instagramUrl = req.body.instagramUrl || user.instagramUrl;
      user.portfolioUrl = req.body.portfolioUrl || user.portfolioUrl;

      const updatedUser = await user.save();
      res.json({
        success: true,
        user: updatedUser
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update user role
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
router.patch('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ success: true, message: 'User removed' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
