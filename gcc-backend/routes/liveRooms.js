const express = require('express');
const router = express.Router();
const LiveRoom = require('../models/LiveRoom');

// Get all active rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await LiveRoom.find({ status: 'Live' }).populate('host', 'username profileImage');
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new room
router.post('/', async (req, res) => {
    const room = new LiveRoom(req.body);
    try {
        const newRoom = await room.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Join a room (update participants)
router.post('/:id/join', async (req, res) => {
    try {
        const room = await LiveRoom.findById(req.params.id);
        if (!room.participants.includes(req.body.userId)) {
            room.participants.push(req.body.userId);
            await room.save();
        }
        res.json(room);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a room (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        await LiveRoom.findByIdAndDelete(req.params.id);
        res.json({ message: 'Room terminated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
