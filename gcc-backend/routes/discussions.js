const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

/**
 * @desc    Get all discussions with filtering
 * @route   GET /api/discussions
 */
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const discussions = await Discussion.find(query)
      .populate('author', 'name avatar xp rank')
      .sort({ createdAt: -1 });

    res.json({ success: true, discussions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Create a new discussion
 * @route   POST /api/discussions
 */
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    const discussion = await Discussion.create({
      author: req.user._id,
      title,
      content,
      category,
      tags
    });

    // Reward XP for starting a discussion
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 10 } });

    res.status(201).json({ success: true, discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Vote on a discussion
 * @route   POST /api/discussions/:id/vote
 */
router.post('/:id/vote', protect, async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) return res.status(404).json({ success: false, message: 'Discussion not found' });

    // Clear previous votes from this user
    discussion.upvotes = discussion.upvotes.filter(id => id.toString() !== req.user._id.toString());
    discussion.downvotes = discussion.downvotes.filter(id => id.toString() !== req.user._id.toString());

    if (type === 'up') {
      discussion.upvotes.push(req.user._id);
    } else if (type === 'down') {
      discussion.downvotes.push(req.user._id);
    }

    await discussion.save();
    res.json({ success: true, upvotes: discussion.upvotes, downvotes: discussion.downvotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
