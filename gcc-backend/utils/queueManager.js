const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const notificationService = require('../utils/notificationService');

let redisConnection;
let emailQueue;
let automationQueue;

try {
  // Redis Connection Configuration with error handling
  redisConnection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    lazyConnect: true, // Don't crash on startup if redis is down
  });

  redisConnection.on('error', (err) => {
    console.warn('⚠️ Redis Connection Error. Background queues might be disabled.', err.message);
  });

  /**
   * EMAIL QUEUE
   */
  emailQueue = new Queue('email-queue', { connection: redisConnection });

  const emailWorker = new Worker('email-queue', async (job) => {
    const { to, subject, body } = job.data;
    console.log(`[Worker] Processing email for ${to}`);
    await notificationService.sendEmail(to, subject, body);
  }, { connection: redisConnection });

  /**
   * AUTOMATION QUEUE
   */
  automationQueue = new Queue('automation-queue', { connection: redisConnection });

  const automationWorker = new Worker('automation-queue', async (job) => {
    const { type, payload } = job.data;
    switch (type) {
      case 'XP_CALCULATION':
        break;
      case 'CERTIFICATE_GEN':
        break;
      default:
        console.log(`Unknown automation type: ${type}`);
    }
  }, { connection: redisConnection });

} catch (err) {
  console.error('❌ Failed to initialize Redis Queues. Falling back to sync mode.', err.message);
}

module.exports = {
  emailQueue,
  automationQueue,
  redisConnection
};
