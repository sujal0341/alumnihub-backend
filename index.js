const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const webpush = require("web-push");
require("dotenv").config();

const connectDB = require("./config/db");
const router = require("./routes/index");

const app = express();

// ✅ CORS (make sure FRONTEND_URL is correct on Vercel)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Connect DB ONCE (important for serverless)
connectDB();

// ✅ VAPID setup
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// ⚠️ In-memory storage (will reset on every invocation on Vercel)
let subscriptions = [];

// Subscribe endpoint
app.post("/api/subscribe", (req, res) => {
  subscriptions.push(req.body);
  res.status(201).json({ message: "Subscription saved" });
});

// Send notification
app.post("/api/send-notification", async (req, res) => {
  try {
    const notificationPayload = {
      notification: {
        title: "Alumni Hub Notification",
        body: req.body.message,
        icon: "https://res.cloudinary.com/dsujse28c/image/upload/v1738330353/OIG1_yps2rt.jpg",
      },
    };

    await Promise.all(
      subscriptions.map((sub) =>
        webpush.sendNotification(sub, JSON.stringify(notificationPayload))
      )
    );

    res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// API routes
app.use("/api", router);

// Health check
app.get("/", (req, res) => {
  res.send("Alumni Hub Backend is running");
});

// ✅ VERY IMPORTANT FOR VERCEL
module.exports = app;
