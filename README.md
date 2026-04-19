# Social Media Management System

A full-stack social media application built with React (Vite), Node.js, Express, and MySQL.

## Prerequisites

- Node.js installed
- MySQL Server running

## Database Setup

1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or terminal).
2. Connect to your MySQL server as `root`.
3. Copy the contents of `backend/schema.sql` and run it to create the `social_media_db` database and its tables.

## Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your `backend/.env` file has the correct database credentials.
4. Start the backend server:
   ```bash
   node server.js
   ```
   (The server will run on `http://localhost:5000`)

## Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   (The frontend will run on `http://localhost:5173`)

## Features

- **Authentication**: JWT-based login and registration.
- **Home Feed**: View posts from users you follow.
- **Explore Feed**: View global posts from everyone.
- **Profile**: View user stats (followers, following, posts) and their specific posts.
- **Interactions**: Like, comment, and share posts.
- **Follow System**: Follow and unfollow users.
