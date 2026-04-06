# Finance Dashboard Backend

A backend system built using Node.js, Express, and PostgreSQL (via Prisma ORM) to manage financial records with secure role-based access control and analytics capabilities.

---

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (via Prisma ORM)
* **Authentication:** JSON Web Tokens (JWT)
* **Security:** bcryptjs, express-rate-limit
* **Validation:** Zod
* **Documentation:** Swagger (swagger-ui-express, swagger-jsdoc)
* **Testing:** Jest, Supertest

---

## Core Features

### Role-Based Access Control (RBAC)

* **Viewer**

  * Access to dashboard analytics only

* **Analyst**

  * Access to dashboard analytics
  * Read access to financial records

* **Admin**

  * Full access to users and financial records
  * Create, update, soft delete, and hard delete operations

---

### Financial Records Management

* Create, update, retrieve, and delete financial records
* Filtering by:

  * Date range
  * Category
  * Type (income/expense)
* Pagination support
* Soft delete using `deletedAt` field

---

### Dashboard Capabilities

* Total income
* Total expenses
* Net balance
* Category-wise aggregation
* Monthly trend analysis
* Recent transactions

---

### Validation & Error Handling

* Zod-based request validation middleware
* Consistent error responses with appropriate HTTP status codes
* Input sanitization before processing

---

### Security Features

* Password hashing using bcrypt
* JWT-based authentication (access + refresh tokens)
* Rate limiting to prevent brute-force attacks

---

## API Modules

* `/api/auth`

  * Register, login, refresh token, current user

* `/api/users`

  * Admin-only user management

* `/api/records`

  * Financial records CRUD + filtering + soft delete

* `/api/dashboard`

  * Aggregated analytics endpoints

---

## Design Decisions

* **Single-role RBAC model** used for simplicity and performance
* **Soft delete strategy** implemented to preserve financial audit trails
* **Prisma ORM** chosen for type safety and maintainable database access
* **Layered architecture** (routes → services → database) for separation of concerns

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone <repository_url>
cd finance-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials:

```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
```

---

### 4. Prisma Setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 5. Run Application

```bash
# Development
npm run dev

# Production
npm start
```

Server runs at:

```
http://localhost:3000
```

---

## API Documentation

Interactive Swagger documentation available at:

```
http://localhost:3000/api/docs
```

---

## Testing

* Integration tests implemented using Jest and Supertest
* Covers:

  * Authentication flows
  * RBAC enforcement
  * Core API endpoints

Run tests:

```bash
npm test
```

---

## Project Structure

```
src/
  config/
  middleware/
  routes/
  services/
prisma/
server.js
```

---

## Summary

This backend system demonstrates:

* Clean architecture and modular design
* Secure authentication and authorization
* Efficient data handling with Prisma
* Scalable API design with proper validation and documentation

---
