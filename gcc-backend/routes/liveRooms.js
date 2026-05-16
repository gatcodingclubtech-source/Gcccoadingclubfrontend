const express = require('express');
const router = express.Router();
const LiveRoom = require('../models/LiveRoom');
const { liveRooms } = require('../utils/roomStore');
const { broadcast } = require('../utils/socketService');

// Get all active rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await LiveRoom.find({ status: 'Live' }).populate('host', 'username profileImage');
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single room details
router.get('/:id', async (req, res) => {
    try {
        const room = await LiveRoom.findById(req.params.id).populate('host', 'username profileImage');
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
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

// Verify room password
router.post('/:id/verify-password', async (req, res) => {
    try {
        const room = await LiveRoom.findById(req.params.id);
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        
        if (room.isLocked && room.password !== req.body.password) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Admin: Monitor real-time stats
router.get('/admin/monitor', async (req, res) => {
    try {
        const dbRooms = await LiveRoom.find({ status: 'Live' }).populate('host', 'username profileImage');
        const monitorData = dbRooms.map(room => {
            const activeData = liveRooms.get(room._id.toString());
            return {
                ...room._doc,
                activeParticipants: activeData ? Array.from(activeData.users.values()) : [],
                activeMessagesCount: activeData ? activeData.messages.length : 0
            };
        });
        res.json(monitorData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update room settings (Admin/Host)
router.patch('/:id', async (req, res) => {
    try {
        const room = await LiveRoom.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // Notify the room about the update via sockets
        broadcast(`room-update-${req.params.id}`, room);
        res.json(room);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Kick participant
router.post('/:id/kick/:socketId', async (req, res) => {
    try {
        const { id, socketId } = req.params;
        const activeRoom = liveRooms.get(id);
        if (activeRoom) {
            activeRoom.users.delete(socketId);
            // We need the socket.io instance to force disconnect or emit kick
            const socketService = require('../utils/socketService');
            // Assuming socketService has a reference to io
            // We'll emit a special 'kicked' event to that socket
            broadcast('force-kick', { roomId: id, socketId });
        }
        res.json({ success: true, message: 'User kicked' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Broadcast Admin Message
router.post('/:id/broadcast', async (req, res) => {
    try {
        const { message } = req.body;
        broadcast('admin-broadcast', { roomId: req.params.id, message });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
