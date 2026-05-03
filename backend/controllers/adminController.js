const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find().select('-password').sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
};

exports.getStats = async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalBalance = await User.aggregate([
    { $group: { _id: null, total: { $sum: '$walletBalance' } } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalUsers,
        totalPlatformLiquidity: totalBalance[0]?.total || 0,
        activeAdmins: await User.countDocuments({ role: 'admin' })
      }
    }
  });
};

exports.updateUserBalance = async (req, res, next) => {
  const { amount, type } = req.body; // type: 'credit' or 'debit'
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (type === 'credit') {
    user.walletBalance += amount;
  } else if (type === 'debit') {
    if (user.walletBalance < amount) {
      return next(new AppError('Insufficient balance to deduct', 400));
    }
    user.walletBalance -= amount;
  }

  await user.save();

  res.status(200).json({
    status: 'success',
    data: { user }
  });
};
