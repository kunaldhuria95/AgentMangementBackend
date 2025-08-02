
# 🛠️ Node.js Backend Server

This is the backend API built using **Node.js** and **Express.js**. It handles user authentication, task management, secure token handling, and communicates with a MongoDB database.

---

## 🔍 Features

- RESTful API architecture
- MongoDB database using Mongoose
- JWT-based authentication (access + refresh tokens)
- Environment-based configuration with `.env`
- Middleware: Helmet, XSS-Clean, Mongo Sanitize, CORS
- Centralized error handling
- CSV/Excel file upload and parsing 
- Task distribution logic

---

## 📦 Server Setup

### 1️⃣ Install Dependencies

```bash
cd server
npm install
```

---

### 2️⃣ Create a `.env` File

At the root of the `server` folder, create a `.env` file and define the following environment variables:

- `PORT` – Port number where the server will run (e.g., 5000)
- `MONGO_URI` – Your MongoDB connection string
- `ACCESS_TOKEN_SECRET` – Secret key to sign access tokens
- `ACCESS_TOKEN_EXPIRY` – Expiration time for access tokens (e.g., 1d)
- `REFRESH_TOKEN_SECRET` – Secret key for refresh tokens
- `REFRESH_TOKEN_EXPIRY` – Expiration time for refresh tokens (e.g., 10d)

> 🔐 **Do not share your actual secrets in public repositories.**

---

### 3️⃣ Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start and listen on:

```
http://localhost:<PORT>
```

Default: `http://localhost:5000`

---

## 🗂️ Suggested Project Structure

```
/server
├── controllers/
├── routes/
├── models/
├── middlewares/
├── utils/
├── index.js
└── .env
```

---

## ✅ Tips

- Use Postman or Thunder Client to test API routes
- Ensure MongoDB is running (locally or via Atlas)
- Keep `.env` secrets out of version control (`.gitignore`)

---

## 📄 License

This project is part of an assignment and intended for educational or demonstration purposes.
