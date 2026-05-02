const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const paymentService = require('../services/PaymentService');

const router = express.Router();

router.post('/create-checkout-session', protect, async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 5) {
      return res.status(400).json({ status: 'fail', message: 'Minimum deposit is $5' });
    }

    const { url } = await paymentService.createCheckoutSession(req.user.id, amount);
    res.status(200).json({ status: 'success', data: { url } });
  } catch (error) {
    next(error);
  }
});

// Stripe requires raw body for webhook verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  try {
    await paymentService.handleWebhook(req.body, signature);
    res.json({ received: true });
  } catch (error) {
    console.error('Stripe Webhook Error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router;
