const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Registration = require('../models/Registration');
const Settings = require('../models/Settings');
const { protect } = require('../middleware/authMiddleware');
const { triggerAutomation } = require('../utils/automation');

const getRazorpayInstance = async () => {
  const settings = await Settings.findOne();
  const key_id = settings?.razorpayKeyId || process.env.RAZORPAY_KEY_ID;
  const key_secret = settings?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys not configured');
  }

  return new Razorpay({ key_id, key_secret });
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { registrationId, amount } = req.body;
    const settings = await Settings.findOne();
    const key_id = settings?.razorpayKeyId || process.env.RAZORPAY_KEY_ID;
    const razorpay = await getRazorpayInstance();

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: 'INR',
      receipt: `receipt_${registrationId}`,
      notes: {
        registrationId: registrationId
      }
    };

    const order = await razorpay.orders.create(options);

    // Store order ID in registration
    await Registration.findByIdAndUpdate(registrationId, {
      transactionId: order.id,
      paymentStatus: 'Pending'
    });

    res.json({ success: true, order, keyId: key_id });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Razorpay keys not configured' });
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      registrationId 
    } = req.body;

    const settings = await Settings.findOne();
    const key_secret = settings?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', key_secret || 'placeholder_secret')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment Verified
      const registration = await Registration.findByIdAndUpdate(registrationId, {
        paymentStatus: 'Verified',
        transactionId: razorpay_payment_id,
        paymentScreenshot: 'RAZORPAY_AUTOMATED'
      }).populate('event');

      // Notify User
      await triggerAutomation({
        userId: req.user._id,
        title: 'Payment Verified! ✅',
        message: `Your payment for ${registration.event.title} has been automatically verified. Your registration is now confirmed.`,
        type: 'EVENT'
      });

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
