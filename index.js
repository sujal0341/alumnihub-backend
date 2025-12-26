const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");
const router = require("./routes/index");

const app = express();

/* ===============================
   CORS CONFIG (VERY IMPORTANT)
================================ */
const allowedOrigins = [
  "https://alumnihub2025.netlify.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ REQUIRED for preflight requests
app.options("*", cors());

/* ===============================
   MIDDLEWARE
================================ */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   DATABASE CONNECTION
================================ */
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

/* ===============================
   ROUTES
================================ */

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Alumni Hub Backend is running",
  });
});

// API routes
app.use("/api", router);

/* ===============================
   EXPORT FOR VERCEL
================================ */
module.exports = app;
