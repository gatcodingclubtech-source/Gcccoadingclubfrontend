const express = require('express');
const router = express.Router();
const Domain = require('../models/Domain');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { notifyAllUsers } = require('../utils/automation');

const DomainRegistration = require('../models/DomainRegistration');
const Notification = require('../models/Notification');

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

// @desc    Get current user's domain applications
// @route   GET /api/domains/my-applications
// @access  Private
router.get('/my-applications', protect, async (req, res) => {
  try {
    const applications = await DomainRegistration.find({ user: req.user._id })
      .populate('domain', 'title icon color')
      .sort('-createdAt');
    res.json({ success: true, applications });
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

    // Notify all users about the new domain
    await notifyAllUsers({
      title: 'New Domain Alert! 🚀',
      message: `${savedDomain.title} interest group is now live! Check it out and apply today.`,
      type: 'DOMAIN',
      icon: 'Rocket'
    });

    res.status(201).json({ success: true, domain: savedDomain });
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

// @desc    Apply for a domain
// @route   POST /api/domains/:id/join
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      return res.status(404).json({ success: false, message: 'Domain not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if already joined (approved)
    if (user.joinedDomains.includes(domain._id)) {
      return res.status(400).json({ success: false, message: 'You are already a member of this domain' });
    }

    // Check if there's a pending application
    const existingApp = await DomainRegistration.findOne({ 
      domain: domain._id, 
      user: user._id, 
      status: 'pending' 
    });

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'Your application is already pending review' });
    }

    const { testScore, totalQuestions } = req.body;

    // Create application
    const application = new DomainRegistration({
      domain: domain._id,
      user: user._id,
      status: 'pending',
      name: user.name,
      email: user.email,
      usn: user.usn,
      department: user.department,
      year: user.year,
      phone: user.phone,
      testScore: testScore || 0,
      totalQuestions: totalQuestions || 0
    });

    await application.save();

    res.json({ success: true, message: `Application for ${domain.title} submitted successfully! Please wait for admin approval.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Apply for a domain as guest
// @route   POST /api/domains/:id/join-guest
// @access  Public
router.post('/:id/join-guest', async (req, res) => {
  try {
    const { name, email, usn, department, year, phone, testScore, totalQuestions } = req.body;
    const domain = await Domain.findById(req.params.id);
    
    if (!domain) {
      return res.status(404).json({ success: false, message: 'Domain not found' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create guest user record first (but don't add to domain yet)
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
      await user.save();
    } else {
      // Check if already joined
      if (user.joinedDomains.includes(domain._id)) {
        return res.status(400).json({ success: false, message: 'Already joined this domain with this email' });
      }
    }

    // Check for pending application
    const existingApp = await DomainRegistration.findOne({ 
      domain: domain._id, 
      user: user._id, 
      status: 'pending' 
    });

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'An application is already pending for this email' });
    }

    // Create application
    const application = new DomainRegistration({
      domain: domain._id,
      user: user._id,
      status: 'pending',
      name: name || user.name,
      email: email || user.email,
      usn: usn || user.usn,
      department: department || user.department,
      year: year || user.year,
      phone: phone || user.phone,
      testScore: testScore || 0,
      totalQuestions: totalQuestions || 0
    });

    await application.save();

    res.json({ success: true, message: `Application for ${domain.title} submitted! Our team will review your profile shortly.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all domain registrations (Admin)
// @route   GET /api/domains/registrations/all
// @access  Private/Admin
router.get('/registrations/all', protect, adminOnly, async (req, res) => {
  try {
    const registrations = await DomainRegistration.find()
      .populate('domain', 'title slug color')
      .populate('user', 'name email avatar')
      .sort('-createdAt');
    res.json({ success: true, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Decide on a domain registration (Admin)
// @route   PUT /api/domains/registrations/:id/decide
// @access  Private/Admin
router.put('/registrations/:id/decide', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const registration = await DomainRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This application has already been processed' });
    }

    registration.status = status;
    registration.decidedAt = Date.now();
    registration.decidedBy = req.user._id;
    await registration.save();

    if (status === 'approved') {
      const user = await User.findById(registration.user);
      if (user && !user.joinedDomains.includes(registration.domain)) {
        user.joinedDomains.push(registration.domain);
        await user.save();
      }

      // Create Notification
      const domain = await Domain.findById(registration.domain);
      await Notification.create({
        user: registration.user,
        title: 'Application Approved! 🎉',
        message: `Welcome to the ${domain.title} domain! You now have full access to its resources.`,
        type: 'DOMAIN',
        icon: 'Layers'
      });
    } else if (status === 'rejected') {
      const domain = await Domain.findById(registration.domain);
      await Notification.create({
        user: registration.user,
        title: 'Application Update',
        message: `Your application for ${domain.title} was not accepted this time. Keep building your skills and try again!`,
        type: 'DOMAIN',
        icon: 'XCircle'
      });
    }

    res.json({ success: true, message: `Application ${status} successfully!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
