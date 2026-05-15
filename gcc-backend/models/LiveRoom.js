const mongoose = require('mongoose');

const liveRoomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { 
        type: String, 
        enum: ['Debate', 'Coding', 'Workshop', 'Hackathon', 'Study'],
        required: true 
    },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxParticipants: { type: Number, default: 20 },
    isLocked: { type: Boolean, default: false },
    password: { type: String },
    requiresApproval: { type: Boolean, default: false },
    approvedParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['Live', 'Ended'], default: 'Live' },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('LiveRoom', liveRoomSchema);
