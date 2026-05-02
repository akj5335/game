const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const walletService = require('./WalletService');
const env = require('../config/env');

exports.createCheckoutSession = async (userId, amount) => {
  const transaction = await Transaction.create({
    userId,
    amount,
    type: 'deposit',
    status: 'pending',
    reference: 'stripe_pending',
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Wallet Deposit',
            description: 'NeonPlay Wallet Top-up',
          },
          unit_amount: amount * 100, // Stripe expects cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${env.NODE_ENV === 'production' ? 'https://neonplay.com' : 'http://localhost:5173'}/wallet?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NODE_ENV === 'production' ? 'https://neonplay.com' : 'http://localhost:5173'}/wallet`,
    client_reference_id: transaction._id.toString(), // Pass the transaction ID to stripe
  });

  return { sessionId: session.id, url: session.url };
};

exports.handleWebhook = async (body, signature) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const transactionId = session.client_reference_id;

    if (transactionId) {
      // Automatically approve the transaction using the existing ACID WalletService logic
      await walletService.approveTransaction(transactionId);
    }
  }

  return true;
};
