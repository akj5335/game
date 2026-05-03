const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

exports.getAllUsers = async (req, res, next) => {
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
};

exports.getStats = async (req, res, next) => {
  const { count: totalUsers, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { data: balanceData, error: balanceError } = await supabase
    .from('profiles')
    .select('wallet_balance');

  const totalBalance = balanceData.reduce((sum, p) => sum + Number(p.wallet_balance), 0);

  const { count: activeAdmins, error: adminError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin');

  if (countError || balanceError || adminError) {
    return next(new AppError('Failed to fetch stats', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalUsers,
        totalPlatformLiquidity: totalBalance,
        activeAdmins
      }
    }
  });
};

exports.updateUserBalance = async (req, res, next) => {
  const { amount, type } = req.body; // type: 'credit' or 'debit'
  const userId = req.params.id;

  if (type === 'credit') {
    await supabase.rpc('increment_wallet', { user_id: userId, amount: amount });
  } else if (type === 'debit') {
    // Basic debit logic (could be improved with a dedicated RPC for safety)
    const { data: profile } = await supabase.from('profiles').select('wallet_balance').eq('id', userId).single();
    if (profile.wallet_balance < amount) {
      return next(new AppError('Insufficient balance to deduct', 400));
    }
    await supabase.from('profiles').update({ wallet_balance: profile.wallet_balance - amount }).eq('id', userId);
  }

  const { data: user } = await supabase.from('profiles').select('*').eq('id', userId).single();

  res.status(200).json({
    status: 'success',
    data: { user }
  });
};
