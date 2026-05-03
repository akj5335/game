const supabase = require('../config/supabase');
const redis = require('../config/redis');

exports.getGames = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 24;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Cache Logic
  const cacheKey = `games:${page}:${limit}:${query.category || 'all'}:${query.sort || 'new'}:${query.search || ''}`;
  
  if (redis.status === 'ready') {
    const cachedGames = await redis.get(cacheKey);
    if (cachedGames) {
      console.log('⚡ Redis Cache Hit:', cacheKey);
      return JSON.parse(cachedGames);
    }
  }

  let dbQuery = supabase
    .from('games')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (query.category) {
    dbQuery = dbQuery.eq('category', query.category);
  }
  
  if (query.search) {
    dbQuery = dbQuery.ilike('title', `%${query.search}%`);
  }

  if (query.sort === 'popular') {
    dbQuery = dbQuery.order('popularity', { ascending: false });
  } else {
    dbQuery = dbQuery.order('created_at', { ascending: false });
  }

  const { data: games, count: total, error } = await dbQuery.range(from, to);

  if (error) throw error;

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
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
};
