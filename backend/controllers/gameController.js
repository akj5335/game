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
