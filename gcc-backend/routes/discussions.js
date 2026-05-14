const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const User = require('../models/User');
const { triggerAutomation } = require('../utils/automation');
const { detectToxicity } = require('../utils/ai');

// Get all discussions
router.get('/', async (req, res) => {
    try {
        const discussions = await Discussion.find()
            .populate('author', 'name username profileImage rank')
            .sort({ isPinned: -1, createdAt: -1 });
        res.json(discussions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a discussion
router.post('/', async (req, res) => {
    const { title, content, author, category, tags } = req.body;
    
    if (detectToxicity(title) || detectToxicity(content)) {
        return res.status(400).json({ message: 'Content flagged by AI for toxicity or spam.' });
    }

    try {
        const discussion = new Discussion({ title, content, author, category, tags });
        const newDiscussion = await discussion.save();
        
        // Automation: Give XP for starting a discussion
        await triggerAutomation('DISCUSSION_CREATED', { userId: author, discussionId: newDiscussion._id });
        
        res.status(201).json(newDiscussion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Downvote a discussion
router.post('/:id/downvote', async (req, res) => {
    const { userId } = req.body;
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (discussion.downvotes.includes(userId)) {
            discussion.downvotes = discussion.downvotes.filter(id => id.toString() !== userId);
        } else {
            discussion.downvotes.push(userId);
            // Remove upvote if exists
            discussion.upvotes = discussion.upvotes.filter(id => id.toString() !== userId);
        }
        await discussion.save();
        res.json(discussion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Upvote a discussion (Improved to remove downvote)
router.post('/:id/upvote', async (req, res) => {
    const { userId } = req.body;
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (discussion.upvotes.includes(userId)) {
            discussion.upvotes = discussion.upvotes.filter(id => id.toString() !== userId);
        } else {
            discussion.upvotes.push(userId);
            // Remove downvote if exists
            discussion.downvotes = discussion.downvotes.filter(id => id.toString() !== userId);
            // Automation: Reward author for upvote
            await triggerAutomation('DISCUSSION_UPVOTED', { authorId: discussion.author, voterId: userId });
        }
        await discussion.save();
        res.json(discussion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add a comment
router.post('/:id/comments', async (req, res) => {
    const { author, content } = req.body;
    try {
        const discussion = await Discussion.findById(req.params.id);
        discussion.comments.push({ author, content });
        await discussion.save();
        
        // Automation: Notify author of new comment
        await triggerAutomation('COMMENT_ADDED', { discussionId: discussion._id, authorId: discussion.author, commenterId: author });
        
        res.status(201).json(discussion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a discussion (Admin only ideally, but keeping it open for now)
router.delete('/:id', async (req, res) => {
    try {
        await Discussion.findByIdAndDelete(req.params.id);
        res.json({ message: 'Discussion deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
