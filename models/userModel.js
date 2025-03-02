const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePictureUrl: {
      type: String,
      default: "", // Default to an empty string if no profile picture is provided
    },
    role: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "New user profile",
    },
    about: {
      type: String,
    },
    skills: {
      type: [String], // Array of strings to store skills
      default: [],
    },
    interests: {
      type: [String], // Array of strings to store interests/hobbies
      default: [],
    },
    languages: [
      {
        language: { type: String },
        proficiency: { type: String },
      },
    ],
    experiences: [
      {
        title: { type: String },
        company: { type: String },
        description: { type: String },
        startDate: { type: Date }, // Start date of the experience
        endDate: { type: Date }, // End date of the experience (optional)
      },
    ],
    projects: [
      {
        name: { type: String },
        description: { type: String },
        link: { type: String },
        dateCompleted: { type: Date },
      },
    ],
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        description: { type: String },
        startDate: { type: Date }, // Start date of the education
        endDate: { type: Date }, // End date of the education (optional)
      },
    ],
    certifications: [
      {
        title: { type: String },
        issuer: { type: String },
        dateEarned: { type: Date },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("User", userSchema);