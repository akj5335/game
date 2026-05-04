const Razorpay = require('razorpay');
const crypto = require('crypto');
const env = require('../config/env');
const AppError = require('../utils/AppError');

class RazorpayService {
  constructor() {
    // We initialize even if keys are missing so the server doesn't crash on startup,
    // but actual calls will throw an error.
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      key_secret: env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
    });
  }

  async createSubscriptionOrder(userId, amount, planName) {
    try {
      const options = {
        amount: amount * 100, // Razorpay works in paise
        currency: 'INR',
        receipt: `receipt_${userId}_${Date.now()}`,
        notes: {
          userId,
          planName
        }
      };

      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay Create Order Error:', error);
      throw new AppError('Failed to create payment order. Please try again.', 500);
    }
  }

  verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
    const secret = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === razorpay_signature;
  }
}

module.exports = new RazorpayService();
