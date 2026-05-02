const Game = require('../models/Game');
const redis = require('../config/redis');

exports.getGames = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 24;
  const skip = (page - 1) * limit;

  let filter = { isActive: true };

  if (query.category) filter.category = query.category;
  if (query.search) {
    filter.title = { $regex: query.search, $options: 'i' };
  }

  let sort = { createdAt: -1 }; // Default new
  if (query.sort === 'popular') sort = { popularity: -1 };

  // Cache Logic
  const cacheKey = `games:${page}:${limit}:${query.category || 'all'}:${query.sort || 'new'}:${query.search || ''}`;
  
  if (redis.status === 'ready') {
    const cachedGames = await redis.get(cacheKey);
    if (cachedGames) {
      console.log('⚡ Redis Cache Hit:', cacheKey);
      return JSON.parse(cachedGames);
    }
  }

  const games = await Game.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean(); // Lean for performance

  const total = await Game.countDocuments(filter);

  const result = {
    games,
    total,
    page,
    pages: Math.ceil(total / limit),
  };

  if (redis.status === 'ready') {
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600); // Cache for 1 hour
  }

  return result;
};

exports.getGameById = async (id) => {
  return await Game.findById(id).lean();
};
