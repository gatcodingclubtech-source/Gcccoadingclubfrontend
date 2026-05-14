const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { triggerAutomation } = require('../utils/automation');

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
      res.json({ success: true, event });
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

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      // Check if user already registered
      if (event.attendees.includes(req.user._id)) {
        return res.status(400).json({ success: false, message: 'Already registered for this event' });
      }

      event.attendees.push(req.user._id);
      event.registeredCount = event.attendees.length;
      await event.save();

      // Trigger Automation: Notify user
      await triggerAutomation({
        userId: req.user._id,
        title: 'Event Registered!',
        message: `You have successfully registered for ${event.title}. See you there!`,
        type: 'EVENT'
      });

      res.json({ success: true, message: 'Registered successfully', registeredCount: event.registeredCount });
    } else {
      res.status(404).json({ success: false, message: 'Event not found' });
    }
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
