const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Settings = require('../models/Settings');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { triggerAutomation, notifyAllUsers } = require('../utils/automation');
const Banner = require('../models/Banner');
const Registration = require('../models/Registration');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({}).sort('date');
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      const settings = await Settings.findOne();
      
      const eventData = {
        ...event.toObject(),
        upiId: event.upiId || settings?.upiId || 'gcc@upi'
      };
      
      res.json({ success: true, event: eventData });
    } else {
      res.status(404).json({ success: false, message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user._id,
    });
    const savedEvent = await event.save();

    // Create an automated banner for this event
    await Banner.create({
      title: savedEvent.title,
      subtitle: savedEvent.shortDesc || 'Click to register and join the session!',
      image: savedEvent.image,
      link: `/event/${savedEvent._id}`,
      type: 'EVENT',
      targetDate: savedEvent.date,
      color: 'emerald',
      isActive: true,
      priority: 5
    });

    // Notify all users about the new event
    await notifyAllUsers({
      title: 'Upcoming Event Alert! 📢',
      message: `New event: ${savedEvent.title} has been scheduled. Check the events page and register now!`,
      type: 'EVENT',
      icon: 'Calendar'
    });

    res.status(201).json({ success: true, event: savedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      Object.assign(event, req.body);
      const updatedEvent = await event.save();

      // Sync automated banner
      await Banner.findOneAndUpdate(
        { link: `/event/${updatedEvent._id}` },
        {
          title: updatedEvent.title,
          subtitle: updatedEvent.shortDesc || 'Click to register and join the session!',
          image: updatedEvent.image,
          targetDate: updatedEvent.date
        }
      );

      res.json({ success: true, event: updatedEvent });
    } else {
      res.status(404).json({ success: false, message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      await event.deleteOne();
      res.json({ success: true, message: 'Event removed' });
    } else {
      res.status(404).json({ success: false, message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Register for an event (Team or Solo)
// @route   POST /api/events/:id/register
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const { teamName, members, teamLeader, additionalInfo, transactionId, paymentScreenshot } = req.body;

    // Check if user already registered
    const existingReg = await Registration.findOne({ event: req.params.id, user: req.user._id });
    if (existingReg) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event' });
    }

    // Validate team size
    if (event.maxTeamSize > 1) {
      if (!members || members.length < event.minTeamSize || members.length > event.maxTeamSize) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid team size. Must be between ${event.minTeamSize} and ${event.maxTeamSize} members.` 
        });
      }
    }

    // Create registration
    const registration = await Registration.create({
      event: event._id,
      user: req.user._id,
      teamName,
      teamLeader,
      members,
      additionalInfo,
      transactionId,
      paymentScreenshot,
      paymentStatus: event.price > 0 ? 'Pending' : 'N/A'
    });

    // Update event attendees and count
    event.attendees.push(req.user._id);
    event.registeredCount = await Registration.countDocuments({ event: event._id });
    await event.save();

    // Trigger Automation: Notify user
    await triggerAutomation({
      userId: req.user._id,
      title: 'Registration Successful! 🎫',
      message: `You have successfully registered for ${event.title}${teamName ? ` as part of team ${teamName}` : ''}.`,
      type: 'EVENT'
    });

    res.status(201).json({ success: true, message: 'Registered successfully', registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update event registration
// @route   PUT /api/events/:id/register
// @access  Private
router.put('/:id/register', protect, async (req, res) => {
  try {
    const { teamName, members, teamLeader, additionalInfo } = req.body;
    
    const registration = await Registration.findOneAndUpdate(
      { event: req.params.id, user: req.user._id },
      { teamName, members, teamLeader, additionalInfo },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    res.json({ success: true, message: 'Registration updated successfully', registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get my registration for an event
// @route   GET /api/events/:id/my-registration
// @access  Private
router.get('/:id/my-registration', protect, async (req, res) => {
  try {
    const registration = await Registration.findOne({ 
      event: req.params.id, 
      user: req.user._id 
    });
    
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    
    res.json({ success: true, registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all registrations for an event
// @route   GET /api/events/:id/registrations
// @access  Private/Admin
router.get('/:id/registrations', protect, adminOnly, async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.id })
      .populate('user', 'name email usn department year phone')
      .sort('-createdAt');

    res.json({ success: true, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get event attendees
// @route   GET /api/events/:id/attendees
// @access  Private/Admin
router.get('/:id/attendees', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('attendees', 'name email usn department year phone');
    if (event) {
      res.json({ success: true, attendees: event.attendees });
    } else {
      res.status(404).json({ success: false, message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
