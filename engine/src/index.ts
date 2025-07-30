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
      tls: true,
    },
  });

  redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
    process.exit(1);
  });

  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Redis connection failed:", error);
    process.exit(1);
  }

  const MAX_MESSAGES_PER_TICK = 5;

  const pollQueue = async () => {
    try {
      let processed = 0;

      while (processed < MAX_MESSAGES_PER_TICK) {
        const message = await redisClient.rPop("messages");
        if (!message) break;

        try {
          engine.process(JSON.parse(message));
        } catch (e) {
          console.error("Error processing message:", e);
        }

        processed++;
      }
    } catch (err) {
      console.error("Polling error:", err);
    }

 
    setTimeout(pollQueue, 100);
  };

  pollQueue();
}

main();
