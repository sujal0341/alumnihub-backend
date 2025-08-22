// models/ConnectionRequestModel.js
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);