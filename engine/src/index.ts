import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";
import { Engine } from "./trade/Engine";

async function main() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL is not defined in environment variables");
  }

  const engine = new Engine();

  const redisClient = createClient({
    url: redisUrl,
    socket: {
      tls: true, // Required for Upstash (set to false for local Redis)
    },
  });

  redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
    process.exit(1); // fail-fast if Redis goes down
  });

  try {
    await redisClient.connect();
    console.log("✅ Connected to Upstash Redis");
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    process.exit(1);
  }

  const pollQueue = async () => {
    try {
      const response = await redisClient.rPop("messages");
      if (response) {
        engine.process(JSON.parse(response));
      }
    } catch (err) {
      console.error("❌ Error during message processing:", err);
    }

    // Short delay to avoid tight infinite loop if queue is empty
    setTimeout(pollQueue, 50);
  };

  pollQueue(); // start polling
}

main();
