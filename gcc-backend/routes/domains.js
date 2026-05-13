const express = require('express');
const router = express.Router();
const Domain = require('../models/Domain');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// @desc    Get all domains
// @route   GET /api/domains
// @access  Public
router.get('/', async (req, res) => {
  try {
    const domains = await Domain.find({}).sort('createdAt');
    res.json({ success: true, domains });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single domain
// @route   GET /api/domains/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const domain = await Domain.findOne({ slug: req.params.id }) || await Domain.findById(req.params.id);
    if (domain) {
      res.json({ success: true, domain });
    } else {
      res.status(404).json({ success: false, message: 'Domain not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create domain
// @route   POST /api/domains
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const domain = new Domain(req.body);
    const savedDomain = await domain.save();
    res.status(201).json({ success: true, domain: savedDomain });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update domain
// @route   PUT /api/domains/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (domain) {
      Object.assign(domain, req.body);
      const updatedDomain = await domain.save();
      res.json({ success: true, domain: updatedDomain });
    } else {
      res.status(404).json({ success: false, message: 'Domain not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete domain
// @route   DELETE /api/domains/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (domain) {
      await domain.deleteOne();
      res.json({ success: true, message: 'Domain removed' });
    } else {
      res.status(404).json({ success: false, message: 'Domain not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
