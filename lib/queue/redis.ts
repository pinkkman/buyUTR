import IORedis from 'ioredis';

function createConnection() {
  if (!process.env.UPSTASH_REDIS_URL) {
    throw new Error('UPSTASH_REDIS_URL not set');
  }
  return new IORedis(process.env.UPSTASH_REDIS_URL, {
    maxRetriesPerRequest: null, // required by BullMQ
    tls: process.env.UPSTASH_REDIS_URL.startsWith('rediss://') ? {} : undefined,
  });
}

export const redisConnection = createConnection();