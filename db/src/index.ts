import 'dotenv/config'; 
import { Client } from 'pg';
import { createClient } from 'redis';  
import { DbMessage } from './types';

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false
  }
});
pgClient.connect();

async function main() {
  const redisClient = createClient({
  url: process.env.REDIS_URL,
  });

  redisClient.on('error', (err) => console.error('Redis error:', err));

await redisClient.connect();
console.log("✅ Connected to Upstash Redis");

    while (true) {
        const response = await redisClient.rPop("db_processor" as string)
        if (!response) {

        }  else {
            const data: DbMessage = JSON.parse(response);
            if (data.type === "TRADE_ADDED") {
                console.log("adding data");
                console.log(data);
                const price = data.data.price;
                const market=data.data.market;
                const timestamp = new Date(data.data.timestamp);
                const query = 'INSERT INTO tata_prices (time, price) VALUES ($1, $2)';
                const values = [timestamp, price];
                await pgClient.query(query, values);

                // Also store in trades table
                const tradeQuery = `
                INSERT INTO trades (id, market, is_buyer_maker, price, quantity, quote_quantity, timestamp)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id) DO NOTHING
                `;

                const tradeValues = [data.data.id, data.data.market, data.data.isBuyerMaker, price, data.data.quantity, data.data.quoteQuantity, new Date(timestamp)];
                await pgClient.query(tradeQuery, tradeValues);

                const updateTickerQuery = `
                UPDATE tickers
                SET first_price = $1,
                    last_price = $1,
                    updated_at = NOW()
                WHERE symbol = $2
            `;
             await pgClient.query(updateTickerQuery, [price, market]);
            }
            else if (data.type === "ORDER_UPDATE") {
            console.log("updating data");
            console.log(data);

            const orderId = data.data.orderId;
            const executedQty = data.data.executedQty; // this is the new increment

            const query = 'UPDATE orders SET executed_qty = executed_qty + $1 WHERE order_id = $2';
            const values = [executedQty, orderId];

            try {
                const res = await pgClient.query(query, values);
                console.log(`Incremented order ${orderId} by executed_qty = ${executedQty}`);
            } catch (err) {
                console.error(`Error updating order ${orderId}:`, err);
            }
            }


            else if(data.type === "NEW_ORDER"){
                console.log("new order")
                console.log(data);
                 const { orderId,userId,filled, side, price, quantity, } = data.data;

                const query = `
                INSERT INTO orders (order_id,user_id, side, price, quantity, executed_qty)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (order_id) DO NOTHING
                `;
                const values = [orderId, userId, side, price, quantity, filled];
                await pgClient.query(query, values);
            }
        }
    }

}

main();