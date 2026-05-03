const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

exports.requestDeposit = async (userId, amount, reference) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount,
      type: 'deposit',
      reference,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);
  return data;
};

exports.requestWithdrawal = async (userId, amount) => {
  // Check available balance
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', userId)
    .single();

  if (profileError) throw new AppError('User not found', 404);

  const { data: pending, error: pendingError } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'withdrawal')
    .eq('status', 'pending');

  if (pendingError) throw new AppError(pendingError.message, 400);

  const pendingAmount = pending.reduce((sum, t) => sum + Number(t.amount), 0);
  const availableBalance = Number(profile.wallet_balance) - pendingAmount;

  if (amount > availableBalance) {
    throw new AppError(`Insufficient available balance. You have ${pendingAmount} in pending withdrawals.`, 400);
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount,
      type: 'withdrawal',
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);
  return data;
};

exports.approveTransaction = async (transactionId) => {
  const { data, error } = await supabase.rpc('approve_transaction', { t_id: transactionId });

  if (error) throw new AppError(error.message, 400);
  if (data.error) throw new AppError(data.error, 400);

  // Fetch updated transaction
  const { data: transaction } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  return transaction;
};

exports.rejectTransaction = async (transactionId) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({ status: 'rejected' })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw new AppError(error.message, 400);
  return data;
};

exports.getUserTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 400);
  return data;
};

exports.getAllPendingTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, profiles(name, phone_number)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw new AppError(error.message, 400);
  return data;
};
