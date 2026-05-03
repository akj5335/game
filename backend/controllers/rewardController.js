const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.claimDailyReward = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const now = new Date();
  const lastClaim = user.lastRewardClaimed;

  if (lastClaim && now.toDateString() === lastClaim.toDateString()) {
    return next(new AppError('Daily reward already claimed today!', 400));
  }

  const bonusAmount = 5.00; // $5 daily bonus
  user.walletBalance += bonusAmount;
  user.lastRewardClaimed = now;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: `Claimed $${bonusAmount} daily bonus!`,
    data: { walletBalance: user.walletBalance }
  });
};

exports.watchAdReward = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  const rewardAmount = 0.50; // $0.50 per ad
  user.walletBalance += rewardAmount;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: `Earned $${rewardAmount} for watching an ad!`,
    data: { walletBalance: user.walletBalance }
  });
};
