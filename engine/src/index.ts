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

  await redisClient.connect();
  console.log("Connected to Upstash Redis");

  while (true) {
    const response = await redisClient.rPop("messages");
    if (response) {
      engine.process(JSON.parse(response));
    }
  }
}

main();
