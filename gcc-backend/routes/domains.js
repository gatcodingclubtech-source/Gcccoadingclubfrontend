const express = require('express');
const router = express.Router();
const Domain = require('../models/Domain');
const User = require('../models/User');
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

// @desc    Join a domain
// @route   POST /api/domains/:id/join
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      return res.status(404).json({ success: false, message: 'Domain not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if already joined
    if (user.joinedDomains.includes(domain._id)) {
      return res.status(400).json({ success: false, message: 'Already joined this domain' });
    }

    user.joinedDomains.push(domain._id);
    // Also update domainInterest if not set
    if (!user.domainInterest) {
      user.domainInterest = domain.title;
    }
    
    await user.save();

    res.json({ success: true, message: `Successfully joined ${domain.title}!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Join a domain as guest
// @route   POST /api/domains/:id/join-guest
// @access  Public
router.post('/:id/join-guest', async (req, res) => {
  try {
    const { name, email, usn, department, year, phone } = req.body;
    const domain = await Domain.findById(req.params.id);
    
    if (!domain) {
      return res.status(404).json({ success: false, message: 'Domain not found' });
    }

    let user = await User.findOne({ email });

    if (user) {
      // If user exists, check if already joined
      if (user.joinedDomains.includes(domain._id)) {
        return res.status(400).json({ success: false, message: 'Already joined this domain with this email' });
      }
      // Update details
      if (usn) user.usn = usn;
      if (department) user.department = department;
      if (year) user.year = year;
      if (phone) user.phone = phone;
    } else {
      // Create guest user
      user = new User({
        name,
        email,
        usn,
        department,
        year,
        phone,
        domainInterest: domain.title,
        profileComplete: !!(name && email && usn && department && year)
      });
    }

    user.joinedDomains.push(domain._id);
    await user.save();

    res.json({ success: true, message: `Successfully joined ${domain.title} as guest!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
