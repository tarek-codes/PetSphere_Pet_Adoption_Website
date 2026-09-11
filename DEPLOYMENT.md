# 🚀 PetSphere - Vercel Fullstack Deployment Guide

This guide walks you through deploying **PetSphere** to **Vercel** as a unified fullstack application.

---

## 🏗️ Architecture Overview

- **Frontend**: React 19 + Vite + TailwindCSS served via Vercel Edge CDN with client-side SPA routing.
- **Backend**: Express 5 REST API running as a serverless function (`/api/*` and route rewrites via `api/index.js`).
- **Database**: MongoDB Atlas cloud cluster with Mongoose and `connect-mongo` session persistence.
- **Same-Origin Benefits**: Because the frontend and backend are served from the same Vercel domain, authentication cookies work seamlessly without cross-origin browser blocking or CORS issues.

---

## 📋 Prerequisites

1. A [Vercel account](https://vercel.com).
2. Your repository pushed to GitHub.
3. Your MongoDB Atlas connection URI.

---

## 🛠️ Step 1: Deploy on Vercel

1. Log into [vercel.com](https://vercel.com) and click **"Add New..."** ➔ **"Project"**.
2. Select your repository: **`tarek-codes/PetSphere_Pet_Adoption_Website`** (or your fork).
3. In the project setup screen:
   - **Framework Preset**: Select **Vite**.
   - **Root Directory**: Leave as `./` (the root directory).
   - **Build Command**: `npm run build` (or leave default).
   - **Output Directory**: `dist` (or leave default).
   - **Install Command**: `npm install` (or leave default).

---

## 🔐 Step 2: Set Environment Variables on Vercel

Under **"Environment Variables"** in the Vercel project configuration, add the following:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
| `SESSION_SECRET` | `<your-random-session-secret>` | Secret key for session signing (e.g. generate a random 32-char string) |
| `NODE_ENV` | `production` | Enables production cookie security |

> [!TIP]
> You **do not** need to set `VITE_API_URL` on Vercel because the application will automatically route requests to the same origin (`/api` / `/login` / `/pets`, etc.) through the rewrites in [`vercel.json`](file:///c:/Users/tarek/Desktop/pet/vercel.json).

4. Click **Deploy**.

---

## 💻 Local Development Workflow

When running locally on your computer:

1. Install root dependencies:
   ```bash
   npm install
   ```
2. Start the backend:
   ```bash
   npm run server
   ```
   *(Starts Express server with live Socket.IO on port 3000)*.
3. Start the frontend:
   ```bash
   npm run dev
   ```
   *(Vite starts on port 5173 and communicates with `http://localhost:3000`)*.
4. Optional Database Seeding:
   ```bash
   npm run seed
   ```
   *(Populates MongoDB Atlas with initial pets, users, and admin accounts)*.

---

## ℹ️ Serverless Considerations on Vercel

- **Persistent WebSockets (`Socket.IO`)**: Vercel Serverless Functions spin down between requests and do not sustain long-lived persistent WebSocket connections. The frontend has been configured with graceful fallback and connection error suppression so the chat interface and pages load smoothly. If you require continuous 24/7 real-time WebSockets in the future, you can host the backend on a continuous platform like Render, Railway, or Fly.io and simply point `VITE_API_URL` to it.
- **Pet Image Uploads**: For permanent image storage in production, use image URLs (Unsplash/ImgBB/Cloudinary), as serverless function disk storage is ephemeral.
