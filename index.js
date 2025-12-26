const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");
const router = require("./routes/index");

const app = express();

/* ===============================
   MIDDLEWARE
================================ */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* ===============================
   DATABASE CONNECTION (SAFE)
================================ */
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

/* ===============================
   WEB PUSH (SAFE INITIALIZATION)
================================ */
let webpush;
let subscriptions = [];

try {
  webpush = require("web-push");

  if (
    process.env.VAPID_PUBLIC_KEY &&
    process.env.VAPID_PRIVATE_KEY
  ) {
    webpush.setVapidDetails(
      "mailto:admin@alumnihub.com",
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    console.log("✅ Web Push initialized");
  } else {
    console.warn("⚠️ VAPID keys missing, push disabled");
  }
} catch (err) {
  console.warn("⚠️ web-push not available:", err.message);
}

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

// Subscribe to push notifications
app.post("/api/subscribe", (req, res) => {
  subscriptions.push(req.body);
  res.status(201).json({ message: "Subscription saved" });
});

// Send notification
app.post("/api/send-notification", async (req, res) => {
  if (!webpush) {
    return res.status(500).json({ error: "Push service not available" });
  }

  try {
    const payload = JSON.stringify({
      notification: {
        title: "Alumni Hub Notification",
        body: req.body.message || "New update available",
        icon: "https://res.cloudinary.com/dsujse28c/image/upload/v1738330353/OIG1_yps2rt.jpg",
      },
    });

    await Promise.all(
      subscriptions.map((sub) =>
        webpush.sendNotification(sub, payload)
      )
    );

    res.status(200).json({ message: "Notification sent" });
  } catch (err) {
    console.error("❌ Push error:", err.message);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// Other APIs
app.use("/api", router);

/* ===============================
   EXPORT FOR VERCEL
================================ */
module.exports = app;
