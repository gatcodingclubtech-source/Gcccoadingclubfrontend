const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [this] // Self-referencing for nested replies
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { 
        type: String, 
        enum: ['Tech Debate', 'Career Advice', 'Project Showcase', 'General', 'Help Wanted', 'AI vs Human'],
        default: 'General'
    },
    tags: [String],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    comments: [commentSchema],
    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);
