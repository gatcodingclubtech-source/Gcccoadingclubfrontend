const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// @desc    Get active banners for user
// @route   GET /api/banners
// @access  Public
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort('-priority -createdAt');
    res.json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create banner (Admin)
// @route   POST /api/banners
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const banner = new Banner(req.body);
    const savedBanner = await banner.save();
    res.status(201).json({ success: true, banner: savedBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update banner (Admin)
// @route   PUT /api/banners/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete banner (Admin)
// @route   DELETE /api/banners/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
