const walletService = require('../services/WalletService');
const { z } = require('zod');

const requestSchema = z.object({
  amount: z.number().positive().min(1),
  reference: z.string().optional(),
});

exports.deposit = async (req, res, next) => {
  try {
    const { amount, reference } = requestSchema.parse(req.body);
    const transaction = await walletService.requestDeposit(req.user.id, amount, reference);
    res.status(201).json({ status: 'success', data: { transaction } });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ status: 'fail', message: error.errors });
    next(error);
  }
};

exports.withdraw = async (req, res, next) => {
  try {
    const { amount } = requestSchema.parse(req.body);
    const transaction = await walletService.requestWithdrawal(req.user.id, amount);
    res.status(201).json({ status: 'success', data: { transaction } });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ status: 'fail', message: error.errors });
    next(error);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const transaction = await walletService.approveTransaction(req.params.id);
    res.status(200).json({ status: 'success', data: { transaction } });
  } catch (error) {
    next(error);
  }
};

exports.reject = async (req, res, next) => {
  try {
    const transaction = await walletService.rejectTransaction(req.params.id);
    res.status(200).json({ status: 'success', data: { transaction } });
  } catch (error) {
    next(error);
  }
};

exports.getMyHistory = async (req, res, next) => {
  try {
    const transactions = await walletService.getUserTransactions(req.user.id);
    res.status(200).json({ status: 'success', data: { transactions } });
  } catch (error) {
    next(error);
  }
};

exports.getPending = async (req, res, next) => {
  try {
    const transactions = await walletService.getAllPendingTransactions();
    res.status(200).json({ status: 'success', data: { transactions } });
  } catch (error) {
    next(error);
  }
};
