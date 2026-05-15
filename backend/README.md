# AI Interview Backend Starter

A scalable Node.js + Express backend starter with MongoDB, dotenv, CORS, error handling middleware, and MVC-style routing.

## Getting started

1. Copy `.env.example` to `.env` and update the values.
2. Run `npm install`.
3. Start the server with `npm run dev`.

## Project structure

- `src/index.js` - application entry point
- `src/app.js` - express app and middleware setup
- `src/config/db.js` - mongoose connection logic
- `src/routes/` - API routes definitions
- `src/controllers/` - request handlers
- `src/models/` - mongoose schemas
- `src/middleware/` - custom middleware
- `src/utils/` - helper utilities
