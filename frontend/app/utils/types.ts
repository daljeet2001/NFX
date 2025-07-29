
export interface KLine {
    close: string;
    end: string;
    high: string;
    low: string;
    open: string;
    quoteVolume: string;
    start: string;
    trades: string;
    volume: string;
}

export interface Trade {
    "id": number,
    "isBuyerMaker": boolean,
    "price": string,
    "quantity": string,
    "quoteQuantity": string,
    "timestamp": number
}

export interface Depth {
    bids: [string, string][],
    asks: [string, string][],
    lastUpdateId: string
}

export interface Ticker {
    "first_price": string,
    "high": string,
    "last_price": string,
    "low": string,
    "price_change": string,
    "price_change_percent": string,
    "quote_volume": string,
    "symbol": string,
    "trades": string,
    "volume": string,
    "updated_at":number
}
export interface Order {
    "orderId":string,
    "userId":string,
    "price":string,
    "quantity":string,
    "filled":string,
    "side": "buy" | "sell"
    "timestamp":number,

}

