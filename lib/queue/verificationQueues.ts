import { Queue } from 'bullmq';
import { redisConnection } from './redis';

export const verificationQueue = new Queue<{ userId: string; imageUrl: string }>(
  'id-verification',
  { connection: redisConnection }
);

export async function addVerificationJob(userId: string, imageUrl: string) {
  await verificationQueue.add('verify', { userId, imageUrl }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  });
}