import { SignalingManager } from "../../utils/SignalingManager";
import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";

 export default function TradeTable({ market }: { market: string }) {
  const [trades, setTrades] = useState<any[]>([]);

 useEffect(() => {
  getTrades(market).then(setTrades);

  const key = `TRADE-${market}`;

  SignalingManager.getInstance().registerCallback("trade", (data: any) => {
    const formatted = {
      price: Number(data.p),
      quantity: Number(data.q),
      timestamp: data.t,
      isBuyerMaker: data.m,
    };
    console.log("Trade data received:", formatted);

    setTrades((prev) => [formatted, ...prev.slice(0, 19)]); // Keep only 20
  }, key);

  SignalingManager.getInstance().sendMessage({
    method: "SUBSCRIBE",
    params: [`trade@${market}`],
  });

  return () => {
    SignalingManager.getInstance().sendMessage({
      method: "UNSUBSCRIBE",
      params: [`trade@${market}`],
    });
    SignalingManager.getInstance().deRegisterCallback("trade", key); // ✅ fixed here
  };
}, [market]);


  return (
    <div className="text-xs text-white mt-2 space-y-1">
   
      {trades.map((trade, index) => (
        <div key={index} className="flex justify-between">
          <span>{trade.price}</span>
          <span className="text-slate-500">{trade.quantity}</span>
        </div>
      ))}
    </div>
  );
}