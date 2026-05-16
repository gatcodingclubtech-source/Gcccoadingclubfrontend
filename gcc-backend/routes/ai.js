const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { protect } = require('../middleware/authMiddleware');

/**
 * @desc    Get AI Mentor response
 * @route   POST /api/ai/mentor
 * @access  Private
 */
router.post('/mentor', protect, async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const response = await aiService.getMentorResponse(prompt, context);
    
    res.json({
      success: true,
      response
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @desc    Analyze content toxicity
 * @route   POST /api/ai/analyze
 * @access  Private
 */
router.post('/analyze', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const analysis = await aiService.checkToxicity(content);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
