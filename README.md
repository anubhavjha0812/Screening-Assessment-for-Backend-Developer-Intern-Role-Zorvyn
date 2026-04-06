# Finance Dashboard Backend

A production-ready robust backend built with Node.js, Express, and PostgreSQL, managed via Prisma ORM. This system tracks financial records and features a powerful authorization pipeline, integrated security patterns, data validation, and automated interactive documentation.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon Platform via Prisma ORM v5)
- **Security:** `bcryptjs` (password hashing), `jsonwebtoken` (Auth & Refresh strategies), `express-rate-limit` (DDoS mitigation).
- **Validation:** `Zod` (strict schema interception middleware).
- **Documentation:** `swagger-ui-express` & `swagger-jsdoc`.
- **Testing:** `jest` & `supertest`.

## Key Features
- **Strict Role-Based Access Control (RBAC):** Hierarchical mapping securely guarding sensitive endpoints:
  - **Viewer:** Reads Dashboard Metrics.
  - **Analyst:** Reads Dashboard Metrics + Reads all granular financial records.
  - **Admin:** Full View, Creation, Updating, Hard Deletion and Soft Deleting capability on Users and Records.
- **Advanced Zod Type-Safety:** All payload data hitting modifying endpoints rigorously checked and stripped by a Zod validation middleware interceptor before proceeding. Returns HTTP 400 Bad Request formatted schema violations.
- **Rate-Limiter Logic:** DDoS mitigation automatically bound onto the `app` instance with stricter `max` requests logic strictly bound to authorization gates avoiding credential brute force attacks.
- **Non-Destructive Deletions:** Implemented `soft-delete` parameters natively into the Postgres `financial_records` architecture.

## Installation & Setup

1. **Clone & Install Dependencies**
```bash
git clone <repository_url>
npm install
```

2. **Environment Variables**
Copy the `.env.example` file to `.env` and configure accordingly.
```bash
cp .env.example .env
```
Ensure your `DATABASE_URL` contains a valid Postgres connection mapped specifically to your cluster (e.g. Neon).

3. **Prisma ORM Initialization**
Generate the database client and push the migrations cleanly to your cloud database.
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. **Running The Backend**
Start the Express server on `localhost`:
```bash
# Production mapping
npm start 

# Development mapping (nodemon)
npm run dev
```

## API Documentation
The whole backend is commented using JSDoc mappings embedded directly into the routes. Assuming you are running locally on port `3000`, interactive Swagger documentation is available at: 
**`http://localhost:3000/api/docs`**

### Available Modules
1. `/api/auth`: Login, Register, Refresh Tokens, Current Sub.
2. `/api/users`: Admin CRUD Operations across users.
3. `/api/records`: Robust Finance Data mapping + Restore / Soft / Hard deletes.
4. `/api/dashboard`: Aggregation Logic across transactions (Categories, Trends, Overviews).

## Testing
We have set up an automated testing suite utilizing `Jest` simulating HTTP flows avoiding browser setups natively.
```bash
npm test
```
*Current Coverage confirms 100% stable HTTP 201/200 OK transitions across Authorization schemas.*
