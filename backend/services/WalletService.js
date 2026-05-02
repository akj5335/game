const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.requestDeposit = async (userId, amount, reference) => {
  const transaction = await Transaction.create({
    userId,
    amount,
    type: 'deposit',
    reference,
    status: 'pending',
  });
  return transaction;
};

exports.requestWithdrawal = async (userId, amount) => {
  // Check available balance before allowing request
  // Available Balance = Total Balance - SUM(Pending Withdrawals)
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  const pendingWithdrawals = await Transaction.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), type: 'withdrawal', status: 'pending' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const pendingAmount = pendingWithdrawals.length > 0 ? pendingWithdrawals[0].total : 0;
  const availableBalance = user.walletBalance - pendingAmount;

  if (amount > availableBalance) {
    throw new AppError(`Insufficient available balance. You have ${pendingAmount} in pending withdrawals.`, 400);
  }

  const transaction = await Transaction.create({
    userId,
    amount,
    type: 'withdrawal',
    status: 'pending',
  });
  
  return transaction;
};

exports.approveTransaction = async (transactionId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transaction = await Transaction.findById(transactionId).session(session);
    if (!transaction) throw new AppError('Transaction not found', 404);
    if (transaction.status !== 'pending') throw new AppError('Transaction is already processed', 400);

    const user = await User.findById(transaction.userId).session(session);

    if (transaction.type === 'deposit') {
      user.walletBalance += transaction.amount;
    } else if (transaction.type === 'withdrawal') {
      if (user.walletBalance < transaction.amount) {
        throw new AppError('User has insufficient balance for this withdrawal', 400);
      }
      user.walletBalance -= transaction.amount;
    }

    transaction.status = 'approved';
    
    await user.save({ session });
    await transaction.save({ session });
    
    await session.commitTransaction();
    session.endSession();

    return transaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

exports.rejectTransaction = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new AppError('Transaction not found', 404);
  if (transaction.status !== 'pending') throw new AppError('Transaction is already processed', 400);

  transaction.status = 'rejected';
  await transaction.save();
  return transaction;
};

exports.getUserTransactions = async (userId) => {
  return await Transaction.find({ userId }).sort({ createdAt: -1 });
};

exports.getAllPendingTransactions = async () => {
  return await Transaction.find({ status: 'pending' }).populate('userId', 'name email').sort({ createdAt: 1 });
};
