
import { Router } from "express";

export const tickersRouter = Router();

tickersRouter.get("/", async (req, res) => {
  const dummyTicker = {
    firstPrice: "100.00",
    high: "120.00",
    lastPrice: "115.50",
    low: "98.75",
    priceChange: "15.50",
    priceChangePercent: "15.50",
    quoteVolume: "1500000",
    symbol: "TATA_INR",
    trades: "12000",
    volume: "10000"
  };

  res.json([dummyTicker]); 
});
