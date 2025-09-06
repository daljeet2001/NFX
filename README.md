![NFX UI Screenshot](./assets/design.png)
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

