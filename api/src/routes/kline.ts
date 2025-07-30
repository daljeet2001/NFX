import 'dotenv/config'; 
import { Client } from 'pg';
import { Router } from "express";
import { RedisManager } from "../RedisManager";

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false
  }
});
pgClient.connect();

export const klineRouter = Router();

klineRouter.get("/", async (req, res) => {
    const { market, interval, startTime, endTime } = req.query;

    let query;
    switch (interval) {
        case '1m':
            query = `SELECT * FROM klines_1m WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1h':
            query = `SELECT * FROM klines_1m WHERE  bucket >= $1 AND bucket <= $2`;
            break;
        case '1w':
            query = `SELECT * FROM klines_1w WHERE bucket >= $1 AND bucket <= $2`;
            break;
        default:
            return res.status(400).send('Invalid interval');
    }

    try {
        //@ts-ignore
        const result = await pgClient.query(query, [new Date(startTime * 1000 as string), new Date(endTime * 1000 as string)]);
        res.json(result.rows.map(x => ({
            close: x.close,
            end: x.bucket,
            high: x.high,
            low: x.low,
            open: x.open,
            quoteVolume: x.quoteVolume,
            start: x.start,
            trades: x.trades,
            volume: x.volume,
        })));
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

klineRouter.get("/orders", async (req, res) => {
  console.log("[GET /orders] Request received");

  try {
    console.log("[GET /orders] Executing query...");
    const result = await pgClient.query("SELECT * FROM orders ORDER BY timestamp DESC");
    console.log("[GET /orders] Query result:", result.rows);

    res.json(result.rows);
  } catch (err) {
    console.error("[GET /orders] Error occurred:", err);
    res.status(500).json({ error: "Internal server error" });
  }

  console.log("[GET /orders] Request handled completely");
});

klineRouter.get("/trades", async (req, res) => {
  console.log("[GET /trades] Request received");

  try {
    console.log("[GET /trades] Executing query...");
    const result = await pgClient.query("SELECT * FROM trades ORDER BY timestamp DESC");
    console.log("[GET /trades] Query result:", result.rows);

    res.json(result.rows);
  } catch (err) {
    console.error("[GET /trades] Error occurred:", err);
    res.status(500).json({ error: "Internal server error" });
  }

  console.log("[GET /trades] Request handled completely");
});

klineRouter.get("/ticker", async (req, res) => {
  console.log("[GET /ticker] Request received");

  try {
    const result = await pgClient.query("SELECT * FROM tickers LIMIT 1");
    console.log("[GET /ticker] Query result:", result.rows);

    res.status(200).json(result.rows); // Send raw rows
  } catch (err) {
    console.error("[GET /ticker] Error occurred:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




