const Notification = require('../models/Notification');
const User = require('../models/User');
const socketService = require('./socketService');

const triggerAutomation = async (event, data) => {
    try {
        // Handle legacy object-style calls
        if (typeof event === 'object' && event.userId) {
            const { userId, title, message, type } = event;
            await Notification.create({ user: userId, title, message, type });
            return;
        }

        let user;
        switch (event) {
            case 'DISCUSSION_CREATED':
                user = await User.findById(data.userId);
                user.xp += 20;
                const discNotif = await Notification.create({
                    user: data.userId,
                    title: 'Community Contribution',
                    message: 'You earned 20 XP for starting a new discussion! Keep it up.',
                    type: 'SYSTEM'
                });
                socketService.sendToUser(data.userId, 'NOTIFICATION', discNotif);
                break;

            case 'DISCUSSION_UPVOTED':
                user = await User.findById(data.authorId);
                user.xp += 5;
                // No notification for every upvote to avoid spam
                break;

            case 'COMMENT_ADDED':
                user = await User.findById(data.authorId);
                const commNotif = await Notification.create({
                    user: data.authorId,
                    title: 'New Reply',
                    message: 'Someone replied to your discussion. Check it out!',
                    type: 'SYSTEM'
                });
                socketService.sendToUser(data.authorId, 'NOTIFICATION', commNotif);
                break;
            
            case 'QUIZ_SUBMITTED':
                user = await User.findById(data.userId);
                user.xp += (data.score || 0) * 2; // Score to XP conversion
                break;
        }

        if (user) {
            // Rank logic based on XP
            let newRank = 'Rookie';
            if (user.xp >= 1000) newRank = 'Legend';
            else if (user.xp >= 500) newRank = 'Elite';
            else if (user.xp >= 200) newRank = 'Core Member';
            else if (user.xp >= 50) newRank = 'Builder';

            if (user.rank !== newRank) {
                user.rank = newRank;
                const rankNotif = await Notification.create({
                    user: user._id,
                    title: '🎉 Rank Up!',
                    message: `Congratulations! You have been promoted to ${newRank}.`,
                    type: 'RANK'
                });
                socketService.sendToUser(user._id, 'NOTIFICATION', rankNotif);
            }
            await user.save();
            // Emit general XP update
            socketService.sendToUser(user._id, 'XP_UPDATE', { xp: user.xp, rank: user.rank });
        }

        console.log(`[AUTOMATION] Event ${event} processed.`);
    } catch (error) {
        console.error('[AUTOMATION ERROR]', error);
    }
};

module.exports = { triggerAutomation };
