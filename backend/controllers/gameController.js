const gameService = require('../services/GameService');

exports.getAllGames = async (req, res, next) => {
  try {
    const result = await gameService.getGames(req.query);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

exports.getGame = async (req, res, next) => {
  try {
    const game = await gameService.getGameById(req.params.id);
    if (!game) {
      return res.status(404).json({ status: 'fail', message: 'Game not found' });
    }
    res.status(200).json({ status: 'success', data: { game } });
  } catch (error) {
    next(error);
  }
};
const supabase = require('../config/supabase');

exports.getLeaderboard = async (req, res, next) => {
  const { data: leaders, error } = await supabase
    .from('profiles')
    .select('name, wallet_balance, referral_count')
    .order('wallet_balance', { ascending: false })
    .limit(10);
    
  if (error) return next(error);
  res.status(200).json({ status: 'success', data: { leaders } });
};
