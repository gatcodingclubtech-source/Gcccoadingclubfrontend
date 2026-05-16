const User = require('../models/User');
const { automationQueue } = require('../utils/queueManager');

/**
 * XP Triggers Configuration
 */
const XP_VALUES = {
  DISCUSSION_START: 15,
  COMMENT_POST: 5,
  PROJECT_UPLOAD: 50,
  QUIZ_COMPLETION: 20,
  EVENT_ATTENDANCE: 100,
  HELPFUL_REPLY: 10,
  DAILY_STREAK: 5
};

class XPService {
  /**
   * Award XP to a user and check for rank upgrades
   */
  async awardXP(userId, action) {
    try {
      const amount = XP_VALUES[action] || 0;
      if (amount === 0) return;

      const user = await User.findById(userId);
      if (!user) return;

      user.xp += amount;
      
      // Calculate Rank
      let newRank = 'Rookie';
      if (user.xp >= 5000) newRank = 'Legend';
      else if (user.xp >= 2000) newRank = 'Core Member';
      else if (user.xp >= 1000) newRank = 'Elite';
      else if (user.xp >= 300) newRank = 'Builder';

      const rankUpgraded = newRank !== user.rank;
      user.rank = newRank;

      await user.save();

      // If rank upgraded, queue a notification and certificate task
      if (rankUpgraded) {
        console.log(`User ${user.name} upgraded to ${newRank}!`);
        // TODO: Push to notification queue
      }

      return { xpGained: amount, currentTotal: user.xp, rank: user.rank };
    } catch (error) {
      console.error('XP Award Error:', error);
    }
  }

  /**
   * Calculate Trust Score based on activity and reputation
   */
  async updateTrustScore(userId) {
    const user = await User.findById(userId);
    if (!user) return;

    // Logic: (Upvotes / Total Projects) * multiplier + (Days Active)
    // For now, a simple mock calculation
    const baseScore = Math.min(100, (user.xp / 100) + (user.streak * 2));
    user.trustScore = Math.round(baseScore);
    await user.save();
  }
}

module.exports = new XPService();
