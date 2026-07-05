# AI Interview Simulator Platform

A full-stack AI-powered interview simulator built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and Groq AI. Users can register, upload a resume, parse resume content, generate interview questions, answer them, and receive AI feedback with scores.

## Tech Stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer
- pdf-parse

### AI
- Groq API
- Llama 3 model

## Project Structure

- frontend/ – React UI and pages
- backend/ – Express API, models, routes, and controllers

## Features Implemented

- User authentication (register/login/profile)
- Protected routes
- Resume upload and basic parsing
- Skill extraction from resume content
- AI-generated interview questions
- AI-based answer evaluation with feedback and scoring
- Dashboard with user profile and latest resume summary

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB running locally or a valid MongoDB Atlas connection string

### Backend
1. Go to the backend folder:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Create a `.env` file and add:
   - `MONGODB_URI=mongodb://localhost:27017/ai-interview-backend`
   - `JWT_SECRET=your_jwt_secret`
   - `GROQ_API_KEY=your_groq_api_key`
4. Start the backend:
   - `npm run dev`

### Frontend
1. Go to the frontend folder:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Create a `.env` file and add:
   - `VITE_API_URL=http://localhost:5000/api`
4. Start the frontend:
   - `npm run dev`

## Run Production Build

- Frontend build:
  - `cd frontend && npm run build`

## Notes

- The frontend and backend are already connected through the API service.
- If you want persistent storage, configure MongoDB properly in the backend environment.
- The AI features will use the Groq API when a valid key is provided.
