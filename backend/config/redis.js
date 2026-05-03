const Redis = require('ioredis');

let redis;

const REDIS_URL = process.env.REDIS_URL;
const REDIS_HOST = process.env.REDIS_HOST;

if (REDIS_URL || REDIS_HOST) {
  redis = new Redis(REDIS_URL || {
    host: REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        console.warn('⚠️ Redis connection failed. Falling back to MongoDB.');
        return null; // Stop retrying
      }
      return Math.min(times * 50, 2000);
    }
  });

  redis.on('connect', () => console.log('✅ Redis Connected'));
  redis.on('error', (err) => console.error('⚠️ Redis Error:', err.message));
} else {
  console.log('ℹ️ Redis not configured. Using MongoDB for all operations.');
  // Create a mock redis object to prevent crashes if it's called
  redis = {
    get: async () => null,
    set: async () => null,
    del: async () => null,
    on: () => {}
  };
}

module.exports = redis;
