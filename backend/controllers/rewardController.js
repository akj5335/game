const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

exports.claimDailyReward = async (req, res, next) => {
  const { data: user, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (fetchError) return next(new AppError('User not found', 404));

  const now = new Date();
  const lastClaim = user.last_reward_claimed ? new Date(user.last_reward_claimed) : null;

  if (lastClaim && now.toDateString() === lastClaim.toDateString()) {
    return next(new AppError('Daily reward already claimed today!', 400));
  }

  const bonusAmount = 5.00; // $5 daily bonus
  
  const { data: updatedUser, error: updateError } = await supabase
    .from('profiles')
    .update({ 
      wallet_balance: Number(user.wallet_balance) + bonusAmount,
      last_reward_claimed: now.toISOString()
    })
    .eq('id', req.user.id)
    .select()
    .single();

  if (updateError) return next(new AppError(updateError.message, 400));

  res.status(200).json({
    status: 'success',
    message: `Claimed $${bonusAmount} daily bonus!`,
    data: { walletBalance: updatedUser.wallet_balance }
  });
};

exports.watchAdReward = async (req, res, next) => {
  const rewardAmount = 0.50; // $0.50 per ad
  
  const { data: user, error: fetchError } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', req.user.id)
    .single();

  if (fetchError) return next(new AppError('User not found', 404));

  const { data: updatedUser, error: updateError } = await supabase
    .from('profiles')
    .update({ 
      wallet_balance: Number(user.wallet_balance) + rewardAmount 
    })
    .eq('id', req.user.id)
    .select()
    .single();

  if (updateError) return next(new AppError(updateError.message, 400));

  res.status(200).json({
    status: 'success',
    message: `Earned $${rewardAmount} for watching an ad!`,
    data: { walletBalance: updatedUser.wallet_balance }
  });
};
