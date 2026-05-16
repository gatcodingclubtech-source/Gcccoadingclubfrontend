const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('addedBy', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      addedBy: req.user._id
    });

    // Award XP for contributing a resource
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 50 } });

    res.status(201).json({ success: true, resource });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    // Check ownership or admin
    if (resource.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this resource' });
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, resource });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    // Check ownership or admin
    if (resource.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this resource' });
    }

    await resource.deleteOne();
    res.json({ success: true, message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
