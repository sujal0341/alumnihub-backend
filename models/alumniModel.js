const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      default: "alumni",
      enum: ["alumni"], // Restrict to "alumni" only
      required: true,
    },
    profileImage: {
      type: String,
      default: "https://res.cloudinary.com/dsujse28c/image/upload/v1738330353/OIG1_yps2rt.jpg",
    },
    expertise: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    studentsConnected: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: "New alumni profile",
    },
    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    experiences: [
      {
        title: { type: String },
        company: { type: String },
        description: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        description: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
    achievements: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alumni", alumniSchema);