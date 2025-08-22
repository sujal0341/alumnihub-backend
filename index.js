const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const webpush = require("web-push"); // Add web-push
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes/index");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// VAPID setup for web push notifications
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto:your-email@example.com", // Replace with your contact email
  publicVapidKey,
  privateVapidKey
);

// Temporary in-memory storage for subscriptions (replace with MongoDB in production)
let subscriptions = [];

// Subscribe endpoint
app.post("/api/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription saved" });
});

// Send notification endpoint
app.post("/api/send-notification", async (req, res) => {
  const { message, targetName } = req.body;

  const notificationPayload = {
    notification: {
      title: "Alumni Hub Notification",
      body: message,
      icon: "https://res.cloudinary.com/dsujse28c/image/upload/v1738330353/OIG1_yps2rt.jpg", // Default icon
    },
  };

  try {
    const promises = subscriptions.map((subscription) =>
      webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
    );
    await Promise.all(promises);
    res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// Existing API routes
app.use("/api", router);

// Health check endpoint (optional)
app.get("/", (req, res) => {
  res.send("Alumni Hub Backend is running");
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });