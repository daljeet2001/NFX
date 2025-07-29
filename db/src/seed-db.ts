const { Client } = require('pg');

const client = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
});

async function initializeDB() {
    await client.connect();

    await client.query(`
        -- Drop materialized views that depend on tata_prices
        DROP MATERIALIZED VIEW IF EXISTS klines_1m;
        DROP MATERIALIZED VIEW IF EXISTS klines_1h;
        DROP MATERIALIZED VIEW IF EXISTS klines_1w;

        -- Now it's safe to drop the tata_prices table
        DROP TABLE IF EXISTS "tata_prices";

        -- Recreate the tata_prices table
        CREATE TABLE "tata_prices"(
            time            TIMESTAMP WITH TIME ZONE NOT NULL,
            price           DOUBLE PRECISION,
            volume          DOUBLE PRECISION,
            currency_code   VARCHAR (10)
        );

        -- Turn tata_prices into a Timescale hypertable
        SELECT create_hypertable('tata_prices', 'time', 'price', 2);
    `);


    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1m AS
        SELECT
            time_bucket('1 minute', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            currency_code
        FROM tata_prices
        GROUP BY bucket, currency_code;
    `);

    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1h AS
        SELECT
            time_bucket('1 hour', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            currency_code
        FROM tata_prices
        GROUP BY bucket, currency_code;
    `);

    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1w AS
        SELECT
            time_bucket('1 week', time) AS bucket,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
            currency_code
        FROM tata_prices
        GROUP BY bucket, currency_code;
    `);

    await client.query(`
    DROP TABLE IF EXISTS trades;
    CREATE TABLE trades (
        id TEXT PRIMARY KEY,
        market TEXT NOT NULL,
        is_buyer_maker BOOLEAN,
        price NUMERIC,
        quantity NUMERIC,
        quote_quantity NUMERIC,
        timestamp TIMESTAMPTZ
    );
`);

await client.query(`
  DROP TABLE IF EXISTS orders;
  CREATE TABLE orders (
    order_id TEXT PRIMARY KEY,
    user_id TEXT,
    market TEXT NOT NULL DEFAULT 'tata',  -- optional default market
    side TEXT CHECK (side IN ('buy', 'sell')),
    price NUMERIC,
    quantity NUMERIC,
    executed_qty NUMERIC,
    timestamp TIMESTAMPTZ DEFAULT NOW()
  );
`);




    await client.end();
    console.log("Database initialized successfully");
}

initializeDB().catch(console.error);