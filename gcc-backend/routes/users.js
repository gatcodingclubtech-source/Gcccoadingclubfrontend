const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const Event = require('../models/Event');
const QuizSession = require('../models/QuizSession');
const Notification = require('../models/Notification');
const upload = require('../middleware/upload');

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

// @desc    Get user activities for timeline
// @route   GET /api/users/profile/activities
// @access  Private
router.get('/profile/activities', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch events user joined
    const events = await Event.find({ attendees: userId }).sort('-date').limit(10);
    
    // Fetch quiz sessions user participated in
    const quizSessions = await QuizSession.find({ 'results.user': userId }).sort('-createdAt').limit(10);

    // Format activities
    const activities = [
      ...events.map(e => ({
        title: e.title,
        desc: `Registered for ${e.category} at ${e.location}`,
        type: 'EVENT',
        date: e.date,
        icon: 'Calendar',
        color: 'emerald'
      })),
      ...quizSessions.map(s => {
        const result = s.results.find(r => r.user.toString() === userId.toString());
        return {
          title: s.title,
          desc: `Completed quiz with score ${result.score}/${result.totalQuestions}`,
          type: 'QUIZ',
          date: result.timestamp,
          icon: 'Trophy',
          color: 'amber'
        };
      })
    ];

    // Add account creation event
    activities.push({
      title: 'Member Joined',
      desc: 'Official GCC Member ID Issued',
      type: 'SYSTEM',
      date: req.user.createdAt,
      icon: 'ShieldCheck',
      color: 'purple'
    });

    // Sort by date descending
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      activities: activities.slice(0, 15) // Limit to latest 15
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('name avatar department year');
    const quizSessions = await QuizSession.find({});
    
    const leaderboard = users.map(user => {
      let score = 0;
      quizSessions.forEach(session => {
        const result = session.results.find(r => r.user.toString() === user._id.toString());
        if (result) score += (result.score || 0);
      });
      
      // Determine Rank
      let rank = 'Rookie';
      if (score >= 500) rank = 'Legend';
      else if (score >= 200) rank = 'Elite';
      else if (score >= 50) rank = 'Builder';

      return {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        department: user.department,
        year: user.year,
        totalPoints: score,
        rank
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

    res.json({ success: true, leaderboard: leaderboard.slice(0, 50) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
router.get('/notifications', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort('-createdAt')
      .limit(20);
    res.json({ success: true, notifications });
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

// @desc    Upload profile picture
// @route   POST /api/users/profile-picture
// @access  Private
router.post('/profile-picture', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.avatar = req.file.path; // This is the Cloudinary URL
      await user.save();
      res.json({ 
        success: true, 
        message: 'Profile picture updated successfully',
        avatar: user.avatar 
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
