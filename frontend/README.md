# AI Interview Frontend Starter

React + Vite frontend with Tailwind CSS, login/register screens, Axios API integration, token storage, and protected routes.

## Setup

1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Start the app with `npm run dev`.

## Notes

- The frontend uses `localStorage` to store the JWT token.
- Protected routes require a valid token in the `Authorization: Bearer ...` header.
- The backend API base URL is configured with `VITE_API_URL`.
