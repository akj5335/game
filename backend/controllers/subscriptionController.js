const razorpayService = require('../services/RazorpayService');
const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

// Plan configurations
const PLANS = {
  'monthly_49': { amount: 49, durationDays: 30, name: 'Basic Monthly (₹49)' },
  'monthly_99': { amount: 99, durationDays: 30, name: 'Premium Monthly (₹99)' }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;

    if (!planId || !PLANS[planId]) {
      return next(new AppError('Invalid plan selected.', 400));
    }

    const plan = PLANS[planId];
    
    // Create Razorpay order
    const order = await razorpayService.createSubscriptionOrder(userId, plan.amount, plan.name);

    res.status(200).json({
      status: 'success',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        planName: plan.name,
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return next(new AppError('Missing payment verification details.', 400));
    }

    if (!PLANS[planId]) {
      return next(new AppError('Invalid plan ID.', 400));
    }

    const plan = PLANS[planId];

    // Verify signature
    const isValid = razorpayService.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return next(new AppError('Payment verification failed. Invalid signature.', 400));
    }

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

    // Update Supabase Database
    // 1. Insert into subscriptions table
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        plan_name: plan.name,
        amount: plan.amount,
        status: 'active',
        expiry_date: expiryDate.toISOString()
      }]);

    if (subError) throw new AppError(subError.message, 500);

    // 2. Update user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        is_subscribed: true,
        subscription_expiry: expiryDate.toISOString()
      })
      .eq('id', userId);

    if (profileError) throw new AppError(profileError.message, 500);

    res.status(200).json({
      status: 'success',
      message: 'Subscription activated successfully!',
      data: {
        is_subscribed: true,
        subscription_expiry: expiryDate
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.requestManualSubscription = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;

    if (!PLANS[planId]) {
      return next(new AppError('Invalid plan selected.', 400));
    }

    const plan = PLANS[planId];

    // Check if a pending manual request already exists
    const { data: existingReq, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending_manual')
      .single();

    if (existingReq) {
      return res.status(200).json({
        status: 'success',
        message: 'You already have a pending request. Please wait for admin approval.'
      });
    }

    // Insert manual request
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        plan_name: plan.name,
        amount: plan.amount,
        status: 'pending_manual',
        razorpay_order_id: 'manual_payment', // Using this field temporarily
        razorpay_payment_id: 'manual', 
        expiry_date: new Date().toISOString() // Placeholder
      }]);

    if (insertError) {
      return next(new AppError('Failed to record manual subscription request: ' + insertError.message, 500));
    }

    res.status(200).json({
      status: 'success',
      message: 'Manual subscription request received. Waiting for approval.'
    });
  } catch (err) {
    next(err);
  }
};
