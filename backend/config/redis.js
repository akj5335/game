const Redis = require('ioredis');

// Connect to Redis. Graceful fallback handled if Redis is not running locally.
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 3) {
      console.warn('⚠️ Redis connection failed. Falling back to MongoDB entirely.');
      return null; // Stop retrying
    }
    return Math.min(times * 50, 2000);
  }
});

redis.on('connect', () => console.log('✅ Redis Connected'));
redis.on('error', (err) => console.error('⚠️ Redis Error:', err.message));

module.exports = redis;
