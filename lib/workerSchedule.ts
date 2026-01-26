import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { Context } from ".keystone/types";

const redisOptions = { host: process.env.REDIS_HOST, port: 6379 };

const connection = new IORedis({
  maxRetriesPerRequest: null,
  ...redisOptions,
});

export async function initSchedulers() {
  const myQueue = new Queue("deleteCustomizeOrderImage", { connection });

  myQueue.obliterate({ force: true });

  await myQueue.add(
    "cleanUpCustomizeOrderImage",
    {},
    {
      removeOnComplete: true,
      removeOnFail: true,
      repeat: {
        pattern: "0 0 */7 * *",
      },
    }
  );
}

export async function runWorkerSchedule(context: Context) {
  const worker = new Worker(
    "deleteCustomizeOrderImage",

    async (job) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const sudoContext = context.sudo();
      const imagesToDelete = await sudoContext.db.CustomizeImage.findMany({
        where: {
          createdAt: {
            lt: sevenDaysAgo,
          },
        },
      });

      if (imagesToDelete.length) {
        await sudoContext.db.CustomizeImage.deleteMany({
          where: imagesToDelete.map((item) => ({ id: item.id })),
        });
      }
    },
    {
      connection,
    }
  );
  worker.on("completed", (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on("failed", (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
  });
  console.log("Worker started!");
}
