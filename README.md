# NFX – Exchange Platform

**NFX** is a high-performance exchange built using a microservices architecture. It includes a custom order-matching engine, real-time WebSocket communication, and a modular backend with separate services for API, Engine, Market Maker, WebSockets, and Database.

![NFX UI Screenshot](./assets/design.png)

---

## 🏗 Architecture Overview

---

## 🔧 Services

| Service        | Description                          | Tech Stack                        |
|----------------|--------------------------------------|-----------------------------------|
| **Frontend**   | User-facing interface                | Next.js, Tailwind CSS      |
| **API**        | RESTful API layer                    | Express.js                        |
| **Engine**     | Order matching logic                 | Node.js                           |
| **WebSocket**  | Live feed for order book      | Express + `ws`                    |
| **Market Maker** | Simulates liquidity with fake orders | Express, Custom MM Logic         |
| **Database**   | Stores orders, trades, market data   | TimescaleDB (PostgreSQL + time-series extensions) |

---
## 🚀 Getting Started Locally

### Prerequisites

- Node.js (18+)
- PostgreSQL or TimescaleDB
- Redis (for message queues)
- Docker (optional)

---

### 📁 Clone Repository

```bash
git clone https://github.com/daljeet2001/NFX.git
📦 Install Dependencies
Install for each service:

cd api && npm install
cd engine && npm install
cd ws && npm install
cd market-maker && npm install
cd frontend && npm install

🔑 Environment Setup
Create .env files in each service folder (api, engine, ws, market-maker, etc.).

For credentials use docker-compose.yml to start redis and timescale db locally

 OR

get cloud based redis from upstash and timescale db from Tiger Cloud(free tier available)

Example for api/.env:

DATABASE_URL=postgres://user:password@host:port/dbname
REDIS_URL=redis://localhost:6379

Example for db/.env:

DATABASE_URL=postgres://user:password@host:port/dbname
REDIS_URL=redis://localhost:6379

Example for engine/.env:

REDIS_URL=redis://localhost:6379

Example for ws/.env:

REDIS_URL=redis://localhost:6379

🏁 Run the Services
Each service can be started individually:


# Terminal 1
cd engine && npm run dev

# Terminal 2
cd api && npm run dev

# Terminal 3
cd ws && npm run dev

# Terminal 4
cd market-maker && npm run dev

# Terminal 5
cd frontend && npm run dev

# Terminal 6
cd db && npm run seed:db(To seed data initially ) then npm run dev

# Terminal 7
cd db && npm run refresh:views(To refresh trading view chart)

