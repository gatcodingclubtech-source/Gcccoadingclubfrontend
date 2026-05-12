const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      
      // Set cookie
      res.cookie('gcc_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      // Check if user should be admin but isn't yet
      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
      if (adminEmails.includes(user.email.toLowerCase()) && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }

      const token = generateToken(user._id);

      res.cookie('gcc_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileComplete: user.profileComplete,
        },
        token,
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// @desc    Complete profile
// @route   POST /api/auth/complete-profile
// @access  Private
router.post('/complete-profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.usn = req.body.usn || user.usn;
      user.department = req.body.department || user.department;
      user.year = req.body.year || user.year;
      user.domainInterest = req.body.domainInterest || user.domainInterest;
      user.githubUrl = req.body.githubUrl || user.githubUrl;
      user.phone = req.body.phone || user.phone;
      user.profileComplete = true;

      const updatedUser = await user.save();
      res.json({
        success: true,
        user: updatedUser,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // Proactively sync admin status on Google login
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    if (adminEmails.includes(req.user.email.toLowerCase()) && req.user.role !== 'admin') {
      req.user.role = 'admin';
      await req.user.save();
    }

    const token = generateToken(req.user._id);
    
    res.cookie('gcc_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Get the first client URL or matching one
    const clientUrls = (process.env.CLIENT_URL || '').split(',');
    const redirectUrl = clientUrls[0] || 'http://localhost:5173';

    // If profile not complete, redirect to completion page
    if (!req.user.profileComplete) {
      res.redirect(`${redirectUrl}/profile/complete?token=${token}`);
    } else {
      res.redirect(`${redirectUrl}/auth?token=${token}`);
    }
  }
);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', (req, res) => {
  res.cookie('gcc_token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out' });
});

module.exports = router;
