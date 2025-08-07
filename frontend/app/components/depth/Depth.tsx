"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "../../utils/SignalingManager";
import  TradeTable  from "./TradeTable";

export function Depth({ market }: { market: string }) {
  const [view, setView] = useState<"depth" | "trades">("depth");
  const [bids, setBids] = useState<[string, string][]>();
  const [asks, setAsks] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>();

  useEffect(() => {
    if (view !== "depth") return;

    SignalingManager.getInstance().registerCallback("depth", (data: any) => {
      // update bids
      setBids((originalBids) => {
        const bidsAfterUpdate = [...(originalBids || [])];

        for (let i = 0; i < bidsAfterUpdate.length; i++) {
          for (let j = 0; j < data.bids.length; j++) {
            if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
              bidsAfterUpdate[i][1] = data.bids[j][1];
              if (Number(bidsAfterUpdate[i][1]) === 0) {
                bidsAfterUpdate.splice(i, 1);
              }
              break;
            }
          }
        }

        for (let j = 0; j < data.bids.length; j++) {
          if (
            Number(data.bids[j][1]) !== 0 &&
            !bidsAfterUpdate.map((x) => x[0]).includes(data.bids[j][0])
          ) {
            bidsAfterUpdate.push(data.bids[j]);
            break;
          }
        }

        bidsAfterUpdate.sort((x, y) => Number(y[0]) - Number(x[0]));
        return bidsAfterUpdate;
      });

      // update asks
      setAsks((originalAsks) => {
        const asksAfterUpdate = [...(originalAsks || [])];

        for (let i = 0; i < asksAfterUpdate.length; i++) {
          for (let j = 0; j < data.asks.length; j++) {
            if (asksAfterUpdate[i][0] === data.asks[j][0]) {
              asksAfterUpdate[i][1] = data.asks[j][1];
              if (Number(asksAfterUpdate[i][1]) === 0) {
                asksAfterUpdate.splice(i, 1);
              }
              break;
            }
          }
        }

        for (let j = 0; j < data.asks.length; j++) {
          if (
            Number(data.asks[j][1]) !== 0 &&
            !asksAfterUpdate.map((x) => x[0]).includes(data.asks[j][0])
          ) {
            asksAfterUpdate.push(data.asks[j]);
            break;
          }
        }

        asksAfterUpdate.sort((x, y) => Number(x[0]) - Number(y[0]));
        return asksAfterUpdate;
      });
    }, `DEPTH-${market}`);

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`depth@${market}`],
    });

    getDepth(market).then((d) => {
      setBids(d.bids.reverse());
      setAsks(d.asks);
    });

    return () => {
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`depth@${market}`],
      });
      SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
    };
  }, [market, view]);

  return (
    <div className="mt-1">
<ViewSwitch view={view} setView={setView} />

{view === "depth" && <TableHeader />}
{view === "trades" && <TradeHeader />}

{view === "depth" ? (
  <>
    {asks && <AskTable asks={asks} />}
    {price && <div>{price}</div>}
    {bids && <BidTable bids={bids} />}
  </>
) : (
  <TradeTable market={market} />
)}

    </div>
  );
}


function TableHeader() {
    return <div className="flex justify-between text-xs">
    <div className="text-white">Price</div>
    <div className="text-slate-500">Size</div>
    <div className="text-slate-500">Total</div>
</div>
}

function TradeHeader() {
    return <div className="flex justify-between text-xs">
    <div className="text-white">Price</div>
    <div className="text-slate-500">Qty</div>
</div>
}





function ViewSwitch({
  view,
  setView,
}: {
  view: "depth" | "trades";
  setView: (v: "depth" | "trades") => void;
}) {
  return (
    <div className="flex mb-2">
      <button
        className={`px-3 py-1 text-sm rounded-l ${
          view === "depth" ? "bg-gray-200 text-black" : "bg-gray-800 text-black"
        }`}
        onClick={() => setView("depth")}
      >
        Depth
      </button>
      <button
        className={`px-3 py-1 text-sm rounded-r ${
          view === "trades" ? "bg-gray-200 text-black" : "bg-gray-800 text-black"
        }`}
        onClick={() => setView("trades")}
      >
        Trades
      </button>
    </div>
  );
}
