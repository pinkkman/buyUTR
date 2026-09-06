import { Worker } from 'bullmq';
import { redisConnection } from './redis';
import { analyzeIdCard } from '@/lib/gemini';
import { sendVerificationEmail } from '../email/verification';
import dbConnect from '@/lib/db';
import User from '@/models/User';

let workerInstance: Worker | null = null;

export function startWorker() {
  if (workerInstance) return workerInstance;

  workerInstance = new Worker<{ userId: string; imageUrl: string }>(
    'id-verification',
    async (job) => {
      const { userId, imageUrl } = job.data;
      await dbConnect();

      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const result = await analyzeIdCard(imageUrl);

      if (result.isAuthentic) {
        user.idVerificationStatus = 'verified';
        user.verified = true;
        user.idVerificationReason = `Verified with ${result.confidence}% confidence.`;
        if (result.name && !user.name) user.name = result.name;
        if (result.rollNumber) user.rollNumber = result.rollNumber;
        if (result.branch) user.branch = result.branch;
      } else {
        user.idVerificationStatus = 'rejected';
        user.verified = false;
        user.idVerificationReason = result.reason;
      }

      await user.save();
      await sendVerificationEmail(user.email, user.name, user.idVerificationStatus, user.idVerificationReason || '');
      return result;
    },
    { connection: redisConnection, concurrency: 2 }
  );

  workerInstance.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  return workerInstance;
}