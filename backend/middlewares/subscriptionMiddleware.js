const AppError = require('../utils/AppError');

exports.requireSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Check if user has is_subscribed flag set to true
    if (!user.is_subscribed) {
      return next(new AppError('Active subscription required to access this resource.', 403));
    }

    // Check if subscription has expired
    if (user.subscription_expiry) {
      const expiryDate = new Date(user.subscription_expiry);
      if (expiryDate < new Date()) {
        return next(new AppError('Your subscription has expired. Please renew.', 403));
      }
    } else {
       return next(new AppError('No subscription expiry date found.', 403));
    }

    next();
  } catch (err) {
    next(err);
  }
};
